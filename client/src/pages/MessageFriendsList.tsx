import React from 'react';
import { FlatList, Pressable, SafeAreaView, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Feather, Ionicon, Entypo } from '../utils/Icons';
import Text from '../components/Text';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Image } from 'react-native';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { themeConfig } from '../utils/theme';

interface Friend {
  id: string;
  name: string;
  username: string;
  image?: string;
}

const friends: Friend[] = [
  {
    id: "1",
    name: 'John',
    username: 'john123',
  },
  {
    id: "2",
    name: 'Jane',
    username: 'jane456',
  },
  {
    id: "3",
    name: 'Alice',
    username: 'alice789',
  },
  {
    id: "4",
    name: 'Bob',
    username: 'bob321',
  },
  {
    id: "5",
    name: 'Sarah',
    username: 'sarah654',
  },
  {
    id: "6",
    name: 'Michael',
    username: 'michael987',
  },
];

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Friend List', undefined>;
}

const MessageFriendsList = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [focus, setFocus] = useState({ search: false });

  return (
    <SafeAreaView className='bg-themeBg flex-1'>
      <View className='p-4'>
        <View className='w-full flex-row items-center px-5 relative'>
          <View className='absolute px-5 ml-5 z-10'>
            <Ionicon name='search' size={25} color={themeConfig.customColors.themeText} />
          </View>
          <TextInput
            className={
              (focus.search === true ? 'border-themeActive' : 'border-transparent') +
              ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 pl-14 text-lg'
            }
            style={{ fontFamily: 'BalooChettan2-Regular' }}
            placeholderTextColor={'#444444bb'}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => {
              setFocus((prev) => {
                return { ...prev, search: true };
              });
            }}
            onBlur={() => {
              setFocus((prev) => {
                return { ...prev, search: false };
              });
            }}
            maxLength={100}
            returnKeyType={'search'}
            blurOnSubmit={true}
            placeholder='Search friends...'
            scrollEnabled={false}
          />
          {searchText && (
            <Pressable
              onPress={() => {
                setSearchText('');
              }}
              className='pr-5 mr-5 absolute right-0'>
              <Feather name='x' size={15} color={themeConfig.customColors.themeText} />
            </Pressable>
          )}
        </View>

        <FlatList
          className='mt-5'
          data={friends.filter((friend) => friend.name.toLowerCase().includes(searchText.toLowerCase()))}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View className='h-2' />}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => {
                navigation.navigate('Messages', { ownerId: item.id });

                console.log('Item pressed');
              }} 
              className='flex-row items-center justify-between p-3 bg-white rounded-lg shadow mb-2'
            >
              <View className='flex-row items-center'>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  }}
                  className='w-14 h-14 rounded-full mr-4'
                />
                <View>
                  <Text className='text-lg font-semibold text-gray-800'>{item.name}</Text>
                  <Text className='text-sm text-gray-500'>@{item.username}</Text>
                </View>
              </View>
              <Entypo name='new-message' size={25} color={themeConfig.customColors.themeText} />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default MessageFriendsList;
