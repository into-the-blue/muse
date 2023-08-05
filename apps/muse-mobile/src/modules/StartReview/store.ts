import { Injectable } from '../../integrations/store';
import { action, makeObservable, observable } from 'mobx';

@Injectable()
export class StartReviewStore {
  constructor() {
    makeObservable(this, {
      count: observable,
      increment: action,
    });
  }

  count = 0;
  increment = () => {
    this.count++;
  };
}
