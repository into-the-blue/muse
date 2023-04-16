import { Card, ReviewRating, LearningState } from './type';
import { today } from './util';
export const getNewCard = (): Card => {
  return {
    due: today(),
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: LearningState.New,
    lastReviewDate: today(),
  };
};
