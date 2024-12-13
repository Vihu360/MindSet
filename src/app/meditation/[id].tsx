import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { meditations } from '../../data';

interface Meditation {
  id: number;
  title: string;
  duration: number; 
}

const audioFiles: { [key: number]: any } = {
  1: require('../../../assets/audio/audio1.mp3'),
  2: require('../../../assets/audio/audio2.mp3'),
  3: require('../../../assets/audio/audio3.mp3'),
};

export default function Details(): JSX.Element {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const params = useLocalSearchParams();
  const id = params.id as string;

  // Updated type assertion for meditation finding
  const meditationLists = meditations.find(
    (meditation) => meditation.id === Number(id)
  ) as Meditation | undefined;

  const loadAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const audioFile = audioFiles[Number(id)];
      if (!audioFile) {
        throw new Error('Audio file not found');
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioFile,
        { shouldPlay: false }
      );

      setSound(newSound);

      // Updated status handling
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis ?? 0);
      }

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const playSound = async () => {
    try {
      if (!sound) {
        await loadAudio();
      }
      await sound?.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  };

  const onSlidingComplete = async (value: number) => {
    try {
      if (sound) {
        const newPosition = value * duration;
        await sound.setPositionAsync(newPosition);
        setPosition(newPosition);
      }
    } catch (error) {
      console.error('Error seeking sound:', error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!meditationLists) {
    return <Text>Meditation not found!</Text>;
  }

  return (
    <SafeAreaView className="bg-red-300 flex-1 p-3 justify-between">
      <View className="flex-1">
        <View className="flex-1">
          <View className="flex-row items-center justify-between p-8">
            <Feather name="info" size={24} color="black" />
            <View className="bg-gray-900 px-3 py-2 rounded-full">
              <Text className="text-zinc-100 text-sm">Today's motivation</Text>
            </View>
            <AntDesign
              onPress={() => router.back()}
              name="close"
              size={26}
              color="black"
            />
          </View>
          <Text className="text-3xl mt-10 text-center font-semibold">
            {meditationLists.title}
          </Text>
        </View>

        <Pressable
          className="p-2 bg-zinc-800 self-center rounded-full w-20 aspect-square items-center justify-center"
          onPress={() => (isPlaying ? pauseSound() : playSound())}
        >
          <FontAwesome
            name={isPlaying ? "pause" : "play"}
            size={24}
            color="snow"
          />
        </Pressable>

        <View className="flex-1">
          <View className="p-5 mt-auto">
            <Slider
              style={{ width: "100%", height: 40 }}
              value={position / duration || 0}
              onSlidingComplete={onSlidingComplete}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
              thumbTintColor="#000000"
            />
            <View className="flex-row justify-between">
              <Text className="text-zinc-800 text-center">
                {formatTime(position)}
              </Text>
              <Text className="text-zinc-800 text-center">
                {formatTime(duration)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}