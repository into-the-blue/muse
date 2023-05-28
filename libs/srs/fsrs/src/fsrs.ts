import { Card, LearningState, ReviewRating, Context } from './type';
import { diffDays, getRatingMap, NEXT_STATE_MAP } from './util';
import { getDifficulty, getStability } from './stabilityAndDifficulty';
import { getNextDueDate } from './dueDate';

const getNextState = (currentState: LearningState, rating: ReviewRating) => {
  return NEXT_STATE_MAP[currentState][rating];
};

const getNextLapses = (card: Card, rating: ReviewRating) => {
  const isNewOrReview = [LearningState.New, LearningState.Review].includes(
    card.state
  );
  const isAgain = rating === ReviewRating.Again;
  if (isNewOrReview && isAgain) return card.lapses + 1;
  return card.lapses;
};

export const reviewCard = (
  card: Card,
  rating: ReviewRating,
  now = new Date()
): Card => {
  const _card = { ...card };
  const difficulty = getRatingMap(
    getDifficulty(card, ReviewRating.Again),
    getDifficulty(card, ReviewRating.Hard),
    getDifficulty(card, ReviewRating.Good),
    getDifficulty(card, ReviewRating.Easy)
  );
  const elapsedDays = diffDays(card.lastReviewDate, now);
  const _context = { card: _card, originCard: card, difficulty, elapsedDays };
  const stability = getRatingMap(
    getStability(_context, ReviewRating.Again),
    getStability(_context, ReviewRating.Hard),
    getStability(_context, ReviewRating.Good),
    getStability(_context, ReviewRating.Easy)
  );
  const context: Context = {
    originCard: card,
    stability,
    difficulty,
    elapsedDays,
  };
  if (_card.state !== LearningState.New) {
    _card.elapsedDays = context.elapsedDays;
  }
  _card.reps += 1; // repeat times
  _card.lastReviewDate = now.toISOString();

  // 1.get next state
  _card.state = getNextState(card.state, rating);
  // 2.get lapses
  _card.lapses = getNextLapses(card, rating);
  // 3.get difficulty and stability
  _card.stability = context.stability[rating];
  _card.difficulty = context.difficulty[rating];
  // 4.get due date
  const { due, scheduledDays } = getNextDueDate(context, rating, now);
  _card.due = due;
  _card.scheduledDays = scheduledDays;
  return _card;
};
