import { StyleSheet, StatusBar, ScrollView, View } from 'react-native';
import { StartReview } from './StartReview';
import { NewInstrument } from './NewInstrument';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Lobby = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView>
          <View style={styles.container}>
            <StartReview />
            <NewInstrument />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    gap: 16,
    padding: 16,
  },
});
