import React from 'react';
import { Keyboard, Pressable, Image, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { getApiBaseUrl } from '../../api';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import Text from '../Text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BlurView, VibrancyView } from '@react-native-community/blur';

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
    <View className='flex w-full bottom-0 absolute shadow-lg pb-4 rounded-t-xl h-[85%] '>
      <View className='absolute w-full h-full -z-10 rounded-t-xl'>
        <VibrancyView
          blurType='light'
          blurAmount={8}
          reducedTransparencyFallbackColor='white'
          className='h-full w-full'
          style={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}></VibrancyView>
      </View>

      <View className='flex-row justify-center'>
        <View className='bg-themeText w-16 h-1 rounded-xl mt-2' />
      </View>

      <Text className='text-2xl font-bold text-center my-3'>Comments</Text>
      <SafeAreaView className='flex h-full'>
        <ScrollView className='px-2'>
          {comments.map((comment, index) => (
            <View key={`comment-${index}`} className='flex-row mb-3 rounded-lg '>
              <Image className='w-10 h-10 rounded-full mr-3' source={{ uri: profileImage || undefined }} />
              <View className='flex-1 bg-white pl-2 rounded-3xl rounded-tl-sm shadow p-2'>
                <Text className='text-xs font-semibold text-gray-500'>{comment.username}</Text>
                <Text className='text-xs'>{comment.text}</Text>
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
