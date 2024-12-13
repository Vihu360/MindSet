import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { meditations } from '../data'
import { MeditationLists } from '../components/meditationLists';


export default function HomeScreen() {
    return (
        <FlatList
        data={meditations}
        className='bg-white'
        contentContainerClassName='m-3 gap-5'
        renderItem={({item}) => <MeditationLists meditation={item} />}
        />
    )
}