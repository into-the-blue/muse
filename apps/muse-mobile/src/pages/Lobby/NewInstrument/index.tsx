import { StyleSheet, TouchableHighlight } from 'react-native';
import { Text } from '@muse/ui-native';
import { useNavigation } from '@react-navigation/native';

export const NewInstrument = () => {
  const navigation = useNavigation();
  const onPressNewInstrument = () => {
    navigation.navigate('SelectNotes');
  };
  return (
    <TouchableHighlight onPress={onPressNewInstrument} style={styles.container}>
      <Text>{'new instrument'}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});
