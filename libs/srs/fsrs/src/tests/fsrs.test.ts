import { reviewCard } from '../fsrs';
import type { Card} from '../type';
import { ReviewRating } from '../type';
import DATA1 from './it1.json';
import DATA2 from './it2.json';
import DATA3 from './it3.json';
import DATA4 from './it4.json';
import DATA5 from './it5.json';

const getAllReviewResults = (card: Card, date: Date) => {
  return {
    again: reviewCard(card, ReviewRating.Again, date),
    hard: reviewCard(card, ReviewRating.Hard, date),
    good: reviewCard(card, ReviewRating.Good, date),
    easy: reviewCard(card, ReviewRating.Easy, date),
  };
};

const compareCard = (card1: Card, card2: Card) => {
  return Object.keys(card1).every((key) => {
    const value1 = card1[key as keyof Card];
    const value2 = card2[key as keyof Card];
    let res = false;
    if (['due', 'lastReviewDate'].includes(key)) {
      res = new Date(value1).getTime() === new Date(value2).getTime();
    } else if (['stability', 'difficulty'].includes(key)) {
      res =
        (value1 as number).toPrecision(16) ===
        (value2 as number).toPrecision(16);
    } else {
      res = value1 === value2;
    }
    if (!res) {
      console.warn({
        card1,
        card2,
      });
      throw new Error(`key: ${key}, Got value: ${value1}, Expect: ${value2}`);
    }
    return res;
  });
};

const transformCard = (card: Card) => {
  return {
    ...card,
    due: new Date(card.due).toISOString(),
    lastReviewDate: new Date(card.lastReviewDate).toISOString(),
    // stability: Number(card.stability.toPrecision(16)),
    // difficulty: Number(card.difficulty.toPrecision(16)),
  };
};
describe('Test fsrs', () => {
  test('First iterate', () => {
    const card = DATA1.startCard;

    const { again, hard, good, easy } = getAllReviewResults(
      card,
      new Date(card.due)
    );

    expect(again).toEqual(transformCard(DATA1.again));
    expect(hard).toEqual(transformCard(DATA1.hard));
    expect(good).toEqual(transformCard(DATA1.good));
    expect(easy).toEqual(transformCard(DATA1.easy));
  });

  test('Second iterate - Good', () => {
    const card = DATA2.startCard;

    const { again, hard, good, easy } = getAllReviewResults(
      card,
      new Date(card.due)
    );

    expect(again).toEqual(transformCard(DATA2.again));
    expect(hard).toEqual(transformCard(DATA2.hard));
    expect(good).toEqual(transformCard(DATA2.good));
    expect(easy).toEqual(transformCard(DATA2.easy));
  });

  test('Third iterate - Good', () => {
    const card = DATA3.startCard;

    const { again, hard, good, easy } = getAllReviewResults(
      card,
      new Date(card.due)
    );

    expect(again).toEqual(transformCard(DATA3.again));
    expect(hard).toEqual(transformCard(DATA3.hard));
    expect(good).toEqual(transformCard(DATA3.good));
    expect(easy).toEqual(transformCard(DATA3.easy));
  });

  test('Fourth iterate - Again', () => {
    const card = DATA4.startCard;

    const { again, hard, good, easy } = getAllReviewResults(
      card,
      new Date(card.due)
    );

    expect(again).toEqual(transformCard(DATA4.again));
    expect(hard).toEqual(transformCard(DATA4.hard));
    expect(good).toEqual(transformCard(DATA4.good));
    expect(easy).toEqual(transformCard(DATA4.easy));
  });

  test('Fifth iterate - Good', () => {
    const card = DATA5.startCard;

    const { again, hard, good, easy } = getAllReviewResults(
      card,
      new Date(card.due)
    );

    expect(again).toEqual(transformCard(DATA5.again));
    expect(hard).toEqual(transformCard(DATA5.hard));
    expect(good).toEqual(transformCard(DATA5.good));
    expect(easy).toEqual(transformCard(DATA5.easy));
  });
});
