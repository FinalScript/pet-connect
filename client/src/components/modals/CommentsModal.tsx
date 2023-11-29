import React from 'react';
import { Keyboard, Pressable, Image, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { getApiBaseUrl } from '../../api';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import Text from '../Text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
  comments: { username: string; text: string }[];
}

const CommentsModel = ({ comments }: Props) => {
  const currentUser = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);

  const getCurrentUserProfileImage = () => {
    if (currentUser) {
      if (currentUser.isPet) {
        const currentPet = pets.find((pet) => pet.id === currentUser.id);
        return currentPet && currentPet.ProfilePicture ? `${getApiBaseUrl()}/${currentPet.ProfilePicture.path}?${Date.now()}` : null;
      } else {
        return owner && owner.ProfilePicture ? `${getApiBaseUrl()}/${owner.ProfilePicture.path}?${Date.now()}` : null;
      }
    }
    return null;
  };

  const profileImage = getCurrentUserProfileImage();

  return (
    <View className='flex w-full bottom-0 absolute shadow-lg pb-4 rounded-t-xl bg-themeBg h-[85%] '>
      <View className='flex-row justify-center'>
        <View className='bg-themeText w-16 h-1 rounded-xl mt-2' />
      </View>

      <Text className='text-2xl font-bold text-center my-3'>Comments</Text>
      <SafeAreaView className='flex h-full'>
        <ScrollView className='px-4'>
          {comments.map((comment, index) => (
            <View key={`comment-${index}`} className='flex-row mb-4 p-3 bg-white rounded-lg shadow'>
              <Image className='w-12 h-12 rounded-full mr-3' source={{ uri: profileImage || undefined }} />
              <View className='flex-1'>
                <Text className='text-lg font-semibold text-gray-500'>{comment.username}</Text>
                <Text className='text-sm'>{comment.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View className='flex-row items-center px-5 pt-5  pb-8 mb-5 bg-white shadow'>
          <Image className='w-12 h-12 rounded-full mr-3' source={{ uri: profileImage || undefined }} />
          <TextInput className='flex-1 h-12 bg-themeInput rounded-3xl px-5' placeholderTextColor='#444444bb' maxLength={30} placeholder='Add a comment...' />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CommentsModel;
