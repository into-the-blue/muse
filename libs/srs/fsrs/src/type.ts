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

export type Context = {
  originCard: Card;
  card: Card;
  stability: {
    [ReviewRating.Again]: number;
    [ReviewRating.Hard]: number;
    [ReviewRating.Good]: number;
    [ReviewRating.Easy]: number;
  };
  difficulty: {
    [ReviewRating.Again]: number;
    [ReviewRating.Hard]: number;
    [ReviewRating.Good]: number;
    [ReviewRating.Easy]: number;
  };
  elapsedDays: number;
};
