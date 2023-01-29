import { FlatList, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '../components/Themed';
import { RootStackParamList, RootStackScreenProps } from '../types';
import Material from '@expo/vector-icons/MaterialCommunityIcons';


type ScreenType = {
  screen: keyof RootStackParamList,
  title: string
}

export default function RootScreen({ navigation }: RootStackScreenProps<'Root'>) {

  const screens: ScreenType[] = [
    {
      screen: 'Stopwatch',
      title: 'Stopwatch',
    },
    {
      screen: 'Stopwatch',
      title: 'Screen2',
    }
  ]


  // ]

  return (
    <View className='flex-1 items-center justify-center '>
      <FlatList
      className='flex-1 w-full'
      data={screens}
      ItemSeparatorComponent={() => 
      <View className='h-[0.5] bg-gray-400 w-full'/>}
        renderItem={({item}) => 
          <TouchableOpacity className='p-4 items-center flex-row justify-between w-full' key={item.title} onPress={() =>
navigation.navigate(item.screen)
          }>
            <Text className='text-xl'>{item.title}</Text>
            <Material name='chevron-right' size={32} />
          </TouchableOpacity>
        } />
    </View>
  );
}

