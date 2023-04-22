import { getNewCard } from './card';
import { Card, LearningState, ReviewRating } from './type';
import { diffDays, today, getRatingMap } from './util';

const Weight = [1, 1, 5, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2, -0.2, 0.2, 1];
const Params = {
  w: Weight,
  requestRetention: 0.9,
  maximumInterval: 36500,
  easyBonus: 1.3,
  hardFactor: 1.2,
};

const initDifficulty = (rating: ReviewRating) => {
  const calculated = Math.max(Params.w[2] + Params.w[3] * (rating - 2), 1);
  return Math.min(calculated, 10);
};

const initStability = (rating: ReviewRating) => {
  return Math.max(Params.w[0] + Params.w[1] * rating, 0.1);
};

const getNextState = (currentState: LearningState, rating: ReviewRating) => {
  const nextState = {
    [LearningState.New]: getRatingMap(
      LearningState.Learning,
      LearningState.Learning,
      LearningState.Learning,
      LearningState.Review
    ),
    [LearningState.Learning]: getRatingMap(
      LearningState.Learning,
      LearningState.Review,
      LearningState.Review,
      LearningState.Review
    ),
    [LearningState.Relearning]: getRatingMap(
      LearningState.Relearning,
      LearningState.Review,
      LearningState.Review,
      LearningState.Review
    ),
    [LearningState.Review]: getRatingMap(
      LearningState.Relearning,
      LearningState.Review,
      LearningState.Review,
      LearningState.Review
    ),
  };
  return nextState[currentState][rating];
};

const getNextLapses = (card: Card, rating: ReviewRating) => {
  const isNewOrReview = [LearningState.New, LearningState.Review].includes(
    card.state
  );
  const isAgain = rating === ReviewRating.Again;
  if (isNewOrReview && isAgain) return card.lapses + 1;
  return card.lapses;
};

export const reviewCard = (card: Card, rating: ReviewRating) => {
  const _card = { ...card };
  if (_card.state !== LearningState.New) {
    card.elapsedDays = diffDays(_card.lastReviewDate);
  }
  _card.reps += 1; // repeat times
  _card.lastReviewDate = today();

  // get next state
  _card.state = getNextState(_card.state, rating);
  // get lapses
  _card.lapses = getNextLapses(card, rating);
  if (_card.state === LearningState.New) {
    // init difficulty and stability
    _card.difficulty = initDifficulty(rating);
    _card.stability = initStability(rating);
  }
};
