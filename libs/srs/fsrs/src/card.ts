import type { Card} from './type';
import { ReviewRating, LearningState } from './type';
export const getNewCard = (): Card => {
  return {
    due: new Date().toISOString(),
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: LearningState.New,
    lastReviewDate: new Date().toISOString(),
  };
};
