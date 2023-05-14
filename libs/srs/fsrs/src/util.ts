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

export const addTime = (
  date: Date,
  quantity: number,
  unit: 'minute' | 'day' | 'week' | 'month' | 'year'
) => {
  const newDate = new Date(date.getTime());
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
