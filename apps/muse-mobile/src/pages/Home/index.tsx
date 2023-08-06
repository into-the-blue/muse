import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Button } from 'react-native';
import { StartReview } from './StartReview';
import { AudioPlayer } from '../../components';
import { PianoSoundFiles } from '../../../assets/audio';

export const Home = () => {
  const [count, setCount] = useState(1);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <StartReview count={count} />
        <Button onPress={() => setCount(count + 1)} title={'Click3'} />
        <AudioPlayer audioSource={PianoSoundFiles.aaa} />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({});
