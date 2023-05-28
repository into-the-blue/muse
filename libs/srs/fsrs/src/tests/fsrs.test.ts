import { reviewCard } from '../fsrs';
import { getNewCard } from '../card';
import { Card, LearningState, ReviewRating } from '../type';

const getAllReviewResults = (card: Card, date: Date) => {
  return {
    again: reviewCard(card, ReviewRating.Again, date),
    hard: reviewCard(card, ReviewRating.Hard, date),
    good: reviewCard(card, ReviewRating.Good, date),
    easy: reviewCard(card, ReviewRating.Easy, date),
  };
};

const START_DATE = new Date('2022-11-29 12:30');
describe('Test fsrs', () => {
  test('First iterate', () => {
    const now = START_DATE;
    const card = getNewCard();

    const { again, hard, good, easy } = getAllReviewResults(card, now);

    expect(again).toEqual({
      due: new Date('2022-11-29 12:31').toISOString(),
      stability: 1,
      difficulty: 6,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 1,
      lapses: 1,
      state: LearningState.Learning,
      lastReviewDate: now.toISOString(),
    });
    expect(hard).toEqual({
      due: new Date('2022-11-29 12:35').toISOString(),
      stability: 2,
      difficulty: 5.5,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 1,
      lapses: 0,
      state: LearningState.Learning,
      lastReviewDate: now.toISOString(),
    });

    expect(good).toEqual({
      due: new Date('2022-11-29 12:40').toISOString(),
      stability: 3,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 1,
      lapses: 0,
      state: LearningState.Learning,
      lastReviewDate: now.toISOString(),
    });
    expect(easy).toEqual({
      due: new Date('2022-12-04 12:30').toISOString(),
      stability: 4,
      difficulty: 4.5,
      elapsedDays: 0,
      scheduledDays: 5,
      reps: 1,
      lapses: 0,
      state: LearningState.Review,
      lastReviewDate: now.toISOString(),
    });
  });
});
