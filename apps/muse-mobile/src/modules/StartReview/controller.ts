import { Instantiable } from '../../integrations/store';
import { StartReviewService } from './service';
@Instantiable()
export class StartReviewController {
  constructor(private service: StartReviewService) {}

  onClickIncrease = () => {
    this.service.increase();
  };
}
