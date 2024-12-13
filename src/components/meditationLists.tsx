import { View, Text, Pressable } from 'react-native'
import { Meditation } from '../types'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';

export function MeditationLists ({meditation} : {meditation: Meditation}) {

    return (
        <Link href={`/meditation/${meditation.id}`} asChild>
        <Pressable className='p-4 border border-gray-300 rounded-2xl'>

            <Text className='text-xl font-semibold'>{meditation.title}</Text>

            <View className='flex-row items-center gap-2'>
            <AntDesign name="clockcircle" size={15} color="gray" />
            <Text className='text-gray-500'>{meditation.duration} min</Text>
            </View>

        </Pressable>
        </Link>

    )
}