import { View, Button, StyleSheet } from 'react-native';
import { Text } from '@muse/ui-native';
import { useUnionResolve } from '../../../integrations/store';
import { StartReviewController } from '../../../modules/controllers';
import { StartReviewStore } from '../../../modules/stores';
import { observer } from 'mobx-react-lite';

type StartReviewProps = {
  //
};

export const StartReview = observer(() => {
  const [store, controller] = useUnionResolve(
    StartReviewStore,
    StartReviewController
  );

  return (
    <View style={styles.container}>
      <Text>{'start review'}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
});
