import { ReviewRating, LearningState } from './type';
export const diffDays = (toDiff: string, base: Date) => {
  const diff = base.getTime() - new Date(toDiff).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

type MapValue = (() => unknown) | unknown;

type ExtractValue<T> = T extends () => unknown ? ReturnType<T> : T;

const _getValue = <V extends MapValue>(val: V) => {
  if (typeof val === 'function') return val();
  return val;
};
export const getRatingMap = <
  Again extends MapValue,
  Hard extends MapValue,
  Good extends MapValue,
  Easy extends MapValue
>(
  again: Again,
  hard: Hard,
  good: Good,
  easy: Easy
) => {
  return {
    [ReviewRating.Again]: _getValue(again) as ExtractValue<Again>,
    [ReviewRating.Hard]: _getValue(hard) as ExtractValue<Hard>,
    [ReviewRating.Good]: _getValue(good) as ExtractValue<Good>,
    [ReviewRating.Easy]: _getValue(easy) as ExtractValue<Easy>,
  };
};

export const addTime = (
  date: Date | string,
  quantity: number,
  unit: 'minute' | 'day' | 'week' | 'month' | 'year'
) => {
  const newDate = new Date(date);
  switch (unit) {
    case 'minute':
      newDate.setMinutes(newDate.getMinutes() + quantity);
      break;
    case 'day':
      newDate.setDate(newDate.getDate() + quantity);
      break;
    case 'week':
      newDate.setDate(newDate.getDate() + quantity * 7);
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + quantity);
      break;
    case 'year':
      newDate.setFullYear(newDate.getFullYear() + quantity);
      break;
  }
  return newDate;
};

export const NEXT_STATE_MAP = {
  [LearningState.New]: getRatingMap(
    LearningState.Learning,
    LearningState.Learning,
    LearningState.Learning,
    LearningState.Review
  ),
  [LearningState.Learning]: getRatingMap(
    LearningState.Learning,
    LearningState.Learning,
    LearningState.Review,
    LearningState.Review
  ),
  [LearningState.Relearning]: getRatingMap(
    LearningState.Relearning,
    LearningState.Relearning,
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

export const Weight = [
  1, 1, 5, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2, -0.2, 0.2, 1,
];
export const Params = {
  w: Weight,
  requestRetention: 0.9,
  maximumInterval: 36500,
  easyBonus: 1.3,
  hardFactor: 1.2,
};

export const meanReversion = (init: number, current: number) => {
  return Params.w[5] * init + (1 - Params.w[5]) * current;
};
