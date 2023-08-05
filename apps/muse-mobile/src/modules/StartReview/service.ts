import { Injectable } from '../../integrations/store';
import { StartReviewStore } from './store';
@Injectable()
export class StartReviewService {
  constructor(private store: StartReviewStore) {}

  increase = () => {
    this.store.increment();
  };
}
