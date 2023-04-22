import { getNewCard } from './card';
import { Card, LearningState, ReviewRating } from './type';
import { diffDays, today } from './util';

const getNextState = (card: Card, rating: ReviewRating) => {};

const rateAgain = (card: Card) => {
  const nextCard = { ...card };

  switch (nextCard.state) {
    case LearningState.New:
      nextCard.state = LearningState.Learning;
      nextCard.lapses += 1;
      break;
    case LearningState.Learning:
    case LearningState.Relearning:
      break;
    case LearningState.Review:
      nextCard.state = LearningState.Relearning;
      nextCard.lapses += 1;
      break;
  }
};

const rateHard = (card: Card) => {
  const nextCard = { ...card };
  switch (nextCard.state) {
    case LearningState.New:
      nextCard.state = LearningState.Learning;
      break;
    case LearningState.Learning:
    case LearningState.Relearning:
    case LearningState.Review:
      nextCard.state = LearningState.Review;
      break;
  }
};

const rateGood = (card: Card) => {
  const nextCard = { ...card };
  switch (nextCard.state) {
    case LearningState.New:
      nextCard.state = LearningState.Learning;
      break;
    case LearningState.Learning:
    case LearningState.Relearning:
    case LearningState.Review:
      nextCard.state = LearningState.Review;
      break;
  }
};

const rateEasy = (card: Card) => {
  const nextCard = { ...card };
  switch (nextCard.state) {
    case LearningState.New:
    case LearningState.Learning:
    case LearningState.Relearning:
    case LearningState.Review:
      nextCard.state = LearningState.Review;
      break;
  }
};

const reviewCard = (card: Card, rating: ReviewRating) => {
  const _card = { ...card };
  if (_card.state !== LearningState.New) {
    card.elapsedDays = diffDays(_card.lastReviewDate);
  }
  _card.reps += 1;
  _card.lastReviewDate = today();
};
