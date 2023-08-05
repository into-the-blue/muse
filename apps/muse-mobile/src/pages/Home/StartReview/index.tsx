import { View, Button } from 'react-native';
import { Text } from '@muse/ui-native';
import { useUnionResolve } from '../../../integrations/store';
import { StartReviewController } from '../../../modules/controllers';
import { StartReviewStore } from '../../../modules/stores';
import { StartReviewService } from '../../../modules/services';
import { observer } from 'mobx-react-lite';

export const StartReview = observer(() => {
  const [store, controller] = useUnionResolve(
    StartReviewStore,
    StartReviewController,
    StartReviewService
  );

  return (
    <View>
      <Text>{'start review'}</Text>
      <Text>{`count: ${store.count}`}</Text>
      <Button title={'increase'} onPress={controller.onClickIncrease} />
    </View>
  );
});
