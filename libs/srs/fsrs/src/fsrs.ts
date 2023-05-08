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

const meanReversion = (init: number, current: number) => {
  return Params.w[5] * init + (1 - Params.w[5]) * current;
};

const initDifficulty = (rating: ReviewRating) => {
  const calculated = Math.max(Params.w[2] + Params.w[3] * (rating - 2), 1);
  return Math.min(calculated, 10);
};

const initStability = (rating: ReviewRating) => {
  return Math.max(Params.w[0] + Params.w[1] * rating, 0.1);
};

const getNextDifficulty = (card: Card, rating: ReviewRating) => {
  const lastDifficulty = card.difficulty;
  const nextD = lastDifficulty + Params.w[4] * (rating - 2);
  return Math.min(Math.max(meanReversion(Params.w[2], nextD), 1), 10);
};

const _nextForgetStability = (
  lastDifficulty: number,
  lastStability: number,
  retrievability: number
) => {
  return (
    Params.w[9] *
    Math.pow(lastDifficulty, Params.w[10]) *
    Math.pow(lastStability, Params.w[11]) *
    Math.exp((1 - retrievability) * Params.w[12])
  );
};

const _nextRecallStability = (
  lastDifficulty: number,
  lastStability: number,
  retrievability: number
) => {
  return (
    lastStability *
    (1 + Math.exp(Params.w[6])) *
    (11 - lastDifficulty) *
    Math.pow(lastStability, Params.w[7]) *
    (Math.exp((1 - retrievability) * Params.w[8]) - 1)
  );
};

const getNextStability = (card: Card, rating: ReviewRating) => {
  const retrievability = Math.exp(
    (Math.log(0.9) * card.elapsedDays) / card.stability
  );
  if (rating === ReviewRating.Again) {
    return _nextForgetStability(
      card.difficulty,
      card.stability,
      retrievability
    );
  }
  return _nextRecallStability(card.difficulty, card.stability, retrievability);
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

  // 1.get next state
  _card.state = getNextState(_card.state, rating);
  // 2.get lapses
  _card.lapses = getNextLapses(card, rating);
  //3.get difficulty and stability
  if (_card.state === LearningState.New) {
    // 3.1.init difficulty and stability
    _card.difficulty = initDifficulty(rating);
    _card.stability = initStability(rating);
  }
  if (_card.state === LearningState.Review) {
    // 3.2.get next difficulty and stability
    _card.difficulty = getNextDifficulty(card, rating);
    _card.stability = getNextStability(card, rating);
  }
};
