import { ReviewRating } from './type';
export const diffDays = (
  toDiff: string,
  base: string = new Date().toISOString()
) => {
  const diff = new Date(base).getTime() - new Date(toDiff).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const today = () => new Date().toISOString();

export const getRatingMap = <Again, Hard, Good, Easy>(
  again: Again,
  hard: Hard,
  good: Good,
  easy: Easy
) => {
  return {
    [ReviewRating.Again]: again,
    [ReviewRating.Hard]: hard,
    [ReviewRating.Good]: good,
    [ReviewRating.Easy]: easy,
  };
};
