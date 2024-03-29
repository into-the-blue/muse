import { Params, meanReversion } from './util';
import type { Card, Context } from './type';
import { ReviewRating, LearningState } from './type';

const _initDifficulty = (rating: ReviewRating) => {
  const calculated = Math.max(Params.w[2] + Params.w[3] * (rating - 2), 1);
  return Math.min(calculated, 10);
};

const _initStability = (rating: ReviewRating) => {
  return Math.max(Params.w[0] + Params.w[1] * rating, 0.1);
};

const _calNextDifficulty = (card: Card, rating: ReviewRating) => {
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
    (1 +
      Math.exp(Params.w[6]) *
        (11 - lastDifficulty) *
        Math.pow(lastStability, Params.w[7]) *
        (Math.exp((1 - retrievability) * Params.w[8]) - 1))
  );
};

const _calNextStability = (
  {
    originCard,
    difficulty,
    elapsedDays,
  }: Pick<Context, 'difficulty' | 'originCard' | 'elapsedDays'>,
  rating: ReviewRating
) => {
  const retrievability = Math.exp(
    (Math.log(0.9) * elapsedDays) / originCard.stability
  );
  if (rating === ReviewRating.Again) {
    return _nextForgetStability(
      difficulty[ReviewRating.Again],
      originCard.stability,
      retrievability
    );
  }
  return _nextRecallStability(
    difficulty[rating],
    originCard.stability,
    retrievability
  );
};

export const getStability = (
  context: Pick<Context, 'difficulty' | 'originCard' | 'elapsedDays'>,
  rating: ReviewRating
) => {
  if (context.originCard.state === LearningState.New) {
    return _initStability(rating);
  }
  if (context.originCard.state === LearningState.Review) {
    return _calNextStability(context, rating);
  }
  return context.originCard.stability;
};

export const getDifficulty = (card: Card, rating: ReviewRating) => {
  if (card.state === LearningState.New) {
    return _initDifficulty(rating);
  }
  if (card.state === LearningState.Review) {
    return _calNextDifficulty(card, rating);
  }
  return card.difficulty;
};
