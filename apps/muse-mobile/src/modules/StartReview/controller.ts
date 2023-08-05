import { Instantiable } from '../../integrations/store';
import { StartReviewService } from './service';
import { BaseController } from '@muse/store';
@Instantiable()
export class StartReviewController extends BaseController {
  constructor(private service: StartReviewService) {
    super();
  }

  onClickIncrease = () => {
    this.service.increase();
  };
}
