import { Button, View } from 'react-native';
import { Audio } from 'expo-av';
import type { AVPlaybackSource } from 'expo-av';
import { useEffect, useState } from 'react';
import { Text } from '@muse/ui-native';

type AudioPlayerProps = {
  audioSource: AVPlaybackSource;
};
export const AudioPlayer = ({ audioSource }: AudioPlayerProps) => {
  const [audio, setAudio] = useState<Audio.Sound | null>(null);

  const playSound = async () => {
    const { sound, status } = await Audio.Sound.createAsync(audioSource, {
      //   shouldPlay: true,
    });
    setAudio(sound);
    const res = await sound.setStatusAsync({ shouldPlay: true });
    // console.warn('sssss');
    // await sound.unloadAsync();
  };

  useEffect(() => {
    return () => {
      audio?.unloadAsync();
    };
  }, [audio]);
  return (
    <View>
      <Text>{'Audio file: ' + audioSource}</Text>
      <Button onPress={playSound} title={'play audio'} />
    </View>
  );
};
