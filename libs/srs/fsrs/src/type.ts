export enum LearningState {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3,
}

export enum ReviewRating {
  Again = 0,
  Hard = 1,
  Good = 2,
  Easy = 3,
}

export type Card = {
  due: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number; // repeat times
  lapses: number;
  state: LearningState;
  lastReviewDate: string;
};
