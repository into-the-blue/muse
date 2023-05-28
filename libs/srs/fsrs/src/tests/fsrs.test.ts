import { reviewCard } from '../fsrs';
import { getNewCard } from '../card';
import { Card, LearningState, ReviewRating } from '../type';
import { addTime } from '../util';

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

  test('Second iterate - Good', () => {
    const lastDue = START_DATE.toISOString();
    const lastGood = {
      due: lastDue,
      stability: 3,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 1,
      lapses: 0,
      state: LearningState.Learning,
      lastReviewDate: lastDue,
    };
    const { again, good, hard, easy } = getAllReviewResults(
      lastGood,
      new Date(lastGood.due)
    );
    expect(again).toEqual({
      due: addTime(lastGood.due, 5, 'minute').toISOString(),
      stability: 3,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 2,
      lapses: 0,
      state: 1,
      lastReviewDate: lastGood.due,
    });
    expect(hard).toEqual({
      due: addTime(lastGood.due, 3, 'day').toISOString(),
      stability: 3,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 3,
      reps: 2,
      lapses: 0,
      state: 2,
      lastReviewDate: lastGood.due,
    });
    expect(good).toEqual({
      due: addTime(lastGood.due, 4, 'day').toISOString(),
      stability: 3,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 4,
      reps: 2,
      lapses: 0,
      state: 2,
      lastReviewDate: lastGood.due,
    });
    expect(easy).toEqual({
      due: addTime(lastGood.due, 5, 'day').toISOString(),
      stability: 3,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 5,
      reps: 2,
      lapses: 0,
      state: 2,
      lastReviewDate: lastGood.due,
    });
  });

  test('Third iterate - Good', () => {
    const lastDue = new Date('2022-11-29 12:40').toISOString();
    const goodCard = {
      due: addTime(lastDue, 4, 'day').toISOString(),
      stability: 3,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 4,
      reps: 2,
      lapses: 0,
      state: 2,
      lastReviewDate: lastDue,
    };
    const { again, good, hard, easy } = getAllReviewResults(
      goodCard,
      new Date(goodCard.due)
    );
    expect(again).toEqual({
      due: addTime(goodCard.due, 5, 'minute').toISOString(),
      stability: 1.9984214794159336,
      difficulty: 5.800000000000001,
      elapsedDays: 4,
      scheduledDays: 0,
      reps: 3,
      lapses: 1,
      state: 3,
      lastReviewDate: goodCard.due,
    });
    expect(hard).toEqual({
      due: addTime(goodCard.due, 4, 'day').toISOString(),
      stability: 9.600729897068845,
      difficulty: 5.4,
      elapsedDays: 4,
      scheduledDays: 4,
      reps: 3,
      lapses: 0,
      state: 2,
      lastReviewDate: goodCard.due,
    });
    expect(good).toEqual({
      due: addTime(goodCard.due, 10, 'day').toISOString(),
      stability: 10.072210604002334,
      difficulty: 5,
      elapsedDays: 4,
      scheduledDays: 10,
      reps: 3,
      lapses: 0,
      state: 2,
      lastReviewDate: goodCard.due,
    });
    expect(easy).toEqual({
      due: addTime(goodCard.due, 13, 'day').toISOString(),
      stability: 10.543691310935824,
      difficulty: 4.6,
      elapsedDays: 4,
      scheduledDays: 13,
      reps: 3,
      lapses: 0,
      state: 2,
      lastReviewDate: goodCard.due,
    });
  });

  test('Fourth iterate - Again', () => {
    const lastDue = new Date('2022-12-03 12:40').toISOString();
    const againCard = {
      due: addTime(lastDue, 5, 'minute').toISOString(),
      stability: 1.9984214794159336,
      difficulty: 5.800000000000001,
      elapsedDays: 4,
      scheduledDays: 0,
      reps: 3,
      lapses: 1,
      state: 3,
      lastReviewDate: lastDue,
    };
    const { again, hard, good, easy } = getAllReviewResults(
      againCard,
      new Date(againCard.due)
    );

    expect(again).toEqual({
      due: addTime(againCard.due, 5, 'minute').toISOString(),
      stability: 1.9984214794159336,
      difficulty: 5.800000000000001,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 4,
      lapses: 1,
      state: 3,
      lastReviewDate: againCard.due,
    });
    expect(hard).toEqual({
      due: addTime(againCard.due, 2, 'day').toISOString(),
      stability: 1.9984214794159336,
      difficulty: 5.800000000000001,
      elapsedDays: 0,
      scheduledDays: 2,
      reps: 4,
      lapses: 1,
      state: 2,
      lastReviewDate: againCard.due,
    });
    expect(good).toEqual({
      due: addTime(againCard.due, 3, 'day').toISOString(),
      stability: 1.9984214794159336,
      difficulty: 5.800000000000001,
      elapsedDays: 0,
      scheduledDays: 3,
      reps: 4,
      lapses: 1,
      state: 2,
      lastReviewDate: againCard.due,
    });
    expect(easy).toEqual({
      due: addTime(againCard.due, 4, 'day').toISOString(),
      stability: 1.9984214794159336,
      difficulty: 5.800000000000001,
      elapsedDays: 0,
      scheduledDays: 4,
      reps: 4,
      lapses: 1,
      state: 2,
      lastReviewDate: againCard.due,
    });
  });

  test('Fifth iterate - Good', () => {
    expect(1).toBe(1);
  });
});
