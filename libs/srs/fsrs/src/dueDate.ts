import { Params, addTime, getRatingMap } from './util';
import type { Card, Context } from './type';
import { ReviewRating, LearningState } from './type';

const _getNextDueDateNew = (
  { stability }: Context,
  rating: ReviewRating,
  now: Date
): Pick<Card, 'due' | 'scheduledDays'> => {
  const due = getRatingMap(
    addTime(now, 1, 'minute').toISOString(),
    addTime(now, 5, 'minute').toISOString(),
    addTime(now, 10, 'minute').toISOString(),
    () => {
      const interval = calNextInterval(
        stability[ReviewRating.Easy] * Params.easyBonus
      ); // easy stability
      return addTime(now, interval, 'day').toISOString();
    }
  )[rating];

  const scheduledDays = getRatingMap(
    0,
    0,
    0,
    () => calNextInterval(stability[ReviewRating.Easy] * Params.easyBonus) // easy stability
  )[rating];
  return {
    due,
    scheduledDays,
  };
};

const _getNextDueDateLearning = (
  { stability }: Context,
  rating: ReviewRating,
  now: Date
): Pick<Card, 'due' | 'scheduledDays'> => {
  const hardInterval = 0;
  const goodInterval = calNextInterval(stability[ReviewRating.Good]);
  const easyInterval = Math.max(
    calNextInterval(stability[ReviewRating.Easy] * Params.easyBonus),
    goodInterval + 1
  );
  const due = getRatingMap(
    addTime(now, 5, 'minute').toISOString(),
    addTime(
      now,
      hardInterval || 10,
      hardInterval ? 'day' : 'minute'
    ).toISOString(),
    addTime(now, goodInterval, 'day').toISOString(),
    addTime(now, easyInterval, 'day').toISOString()
  )[rating];
  const scheduledDays = getRatingMap(
    0,
    hardInterval,
    goodInterval,
    easyInterval
  )[rating];
  return {
    due,
    scheduledDays,
  };
};

const _getNextDueDateReview = (
  { originCard, stability }: Context,
  rating: ReviewRating,
  now: Date
): Pick<Card, 'due' | 'scheduledDays'> => {
  let hardInterval = calNextInterval(originCard.stability * Params.hardFactor);
  let goodInterval = calNextInterval(stability[ReviewRating.Good]);
  hardInterval = Math.min(hardInterval, goodInterval);
  goodInterval = Math.max(goodInterval, hardInterval + 1);
  const easyInterval = Math.max(
    calNextInterval(stability[ReviewRating.Easy] * Params.hardFactor),
    goodInterval + 1
  );

  const due = getRatingMap(
    addTime(now, 5, 'minute').toISOString(),
    addTime(now, hardInterval, 'day').toISOString(),
    addTime(now, goodInterval, 'day').toISOString(),
    addTime(now, easyInterval, 'day').toISOString()
  )[rating];
  const scheduledDays = getRatingMap(
    0,
    hardInterval,
    goodInterval,
    easyInterval
  )[rating];
  return {
    due,
    scheduledDays,
  };
};

const calNextInterval = (stability: number) => {
  const nextInterval =
    (stability * Math.log(Params.requestRetention)) / Math.log(0.9);
  return Math.min(
    Math.max(Math.round(nextInterval), 1),
    Params.maximumInterval
  );
};
export const getNextDueDate = (
  context: Context,
  rating: ReviewRating,
  now: Date
): Pick<Card, 'due' | 'scheduledDays'> => {
  switch (context.originCard.state) {
    case LearningState.New:
      return _getNextDueDateNew(context, rating, now);
    case LearningState.Learning:
    case LearningState.Relearning:
      return _getNextDueDateLearning(context, rating, now);
    case LearningState.Review:
      return _getNextDueDateReview(context, rating, now);
  }
};
