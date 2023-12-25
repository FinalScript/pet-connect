import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicon } from '../utils/Icons';
import Text from '../components/Text';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Image } from 'react-native';
import { useState } from 'react';
import { TextInput } from 'react-native';

interface Friend {
  id: number;
  name: string;
  username: string;
  image: string;
}

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Friend List', undefined>;
}

const MessageFriendsList = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState('');
  const friends: Friend[] = [
    {
      id: 1,
      name: 'John',
      username: 'john123',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      name: 'Jane',
      username: 'jane456',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 3,
      name: 'Alice',
      username: 'alice789',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 4,
      name: 'Bob',
      username: 'bob321',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 5,
      name: 'Sarah',
      username: 'sarah654',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 6,
      name: 'Michael',
      username: 'michael987',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return (
    <SafeAreaView className='bg-gray-50 flex-1'>
      <View className='p-4'>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder='Search friends...'
          className='rounded-lg border border-gray-300 bg-white px-4 py-3 mb-4 shadow-sm'
        />
        <FlatList
          data={friends.filter((friend) => friend.name.toLowerCase().includes(searchText.toLowerCase()))}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View className='h-2' />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {}} className='flex-row items-center p-3 bg-white rounded-lg shadow mb-2'>
              <Image source={{ uri: item.image }} className='w-14 h-14 rounded-full mr-4' />
              <View>
                <Text className='text-lg font-semibold text-gray-800'>{item.name}</Text>
                <Text className='text-sm text-gray-500'>@{item.username}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default MessageFriendsList;
