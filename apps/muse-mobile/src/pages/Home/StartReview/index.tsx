import { View, Button } from 'react-native';
import { Text } from '@muse/ui-native';
import { useUnionResolve } from '../../../integrations/store';
import { StartReviewController } from '../../../modules/controllers';
import { StartReviewStore } from '../../../modules/stores';
import { observer } from 'mobx-react-lite';

type StartReviewProps = {
  count: number;
};

export const StartReview = observer(({ count }: StartReviewProps) => {
  const [store, controller] = useUnionResolve(
    StartReviewStore,
    StartReviewController
  );

  return (
    <View>
      <Text>{'start review'}</Text>
      <Text>{`count: ${store.count}`}</Text>
      <Text>{`count2: ${count}`}</Text>
      <Button title={'increasee'} onPress={controller.onClickIncrease} />
    </View>
  );
});
