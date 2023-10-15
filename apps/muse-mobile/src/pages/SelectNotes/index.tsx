import { Text } from '@muse/ui-native';
import { SafeAreaView, Button } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

export const SelectNotes = () => {
  const width = useSharedValue(100);
  const onPress = () => {
    width.value = withSpring(width.value + 50);
  };
  return (
    <SafeAreaView>
      <Text>{'Select notes'}</Text>
      <Animated.View
        style={{
          width,
          height: 100,
          backgroundColor: 'violet',
        }}
      />
      <Button onPress={onPress} title={'press me'} />
    </SafeAreaView>
  );
};
