import React, { useState } from 'react';
import { SafeAreaView, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Text from '../components/Text';
import { RootStackParamList } from '../../App';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'Messages'>;

interface Friend {
  id: string;
  name: string;
  username: string;
  image?: string;
}

const friend: Friend = {
  id: '1',
  name: 'John',
  username: 'john123',
  image:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

const owner: Friend = {
  id: '2',
  name: 'Aimen',
  username: 'owner123',
  image: 'https://th.bing.com/th/id/R.b91dca811abeb096b245b952cfb8b8d1?rik=wj%2bV%2bIf44NEIlA&pid=ImgRaw&r=0',
};

const Messages = ({
  route: {
    params: { ownerId },
  },
  navigation,
}: Props) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    setMessages([...messages, { user: owner.name, message: newMessage }]);
    setNewMessage('');
  };

  return (
    <SafeAreaView className='h-full w-full bg-gray-100 p-5'>
      <ScrollView className='flex-grow'>
        {messages.map((message, index) => (
          <View key={index} className='flex-row items-start p-4 bg-white rounded-lg mb-4 shadow-md'>
            <Image source={{ uri: owner.image }} className='w-14 h-14 rounded-full mr-4' />
            <View>
              <Text className='font-bold text-lg'>{owner.name}</Text>
              <Text className='text-sm text-gray-500'>{owner.username}</Text>
              <Text className='mt-2 text-gray-600'>{message.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View className='w-full flex-row items-center mt-4'>
        <View className='flex-grow pl-5'>
          <TextInput
            className='border-transparent bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-lg'
            style={{ fontFamily: 'BalooChettan2-Regular' }}
            placeholderTextColor='#444444bb'
            value={newMessage}
            onChangeText={setNewMessage}
            maxLength={100}
            returnKeyType='search'
            blurOnSubmit={true}
            placeholder='Send a message...'
            scrollEnabled={false}
          />
        </View>
        <TouchableOpacity onPress={handleSend} className='p-4'>
          <Ionicons name='send' size={30} color='#8f5f43' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Messages;
