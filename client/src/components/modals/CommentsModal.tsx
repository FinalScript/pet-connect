import React from 'react';
import { View, Text, Image, TextInput } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import { getApiBaseUrl } from '../../api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CommentsModel = () => {
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
    <View className={`flex w-full bottom-0 absolute shadow-lg px-5 pb-7 rounded-t-xl bg-themeBg h-[70%]`}>
      <View className='flex-row justify-center'>
        <View className='bg-themeText w-16 h-1 rounded-xl mt-2'></View>
      </View>
      <Text className='text-3xl font-bold text-center mb-4'>Comments</Text>
        <View className='flex-row items-center absolute bottom-0 left-0 right-0 px-5 py-3'>
          {profileImage ? (
            <Image style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} source={{ uri: profileImage }} />
          ) : (
            <Ionicon name='person' size={50} style={{ opacity: 0.8, marginRight: 10 }} />
          )}
          <TextInput
            className={'flex-1 border-transparent bg-themeInput border-[5px] shadow-sm shadow-themeShadow rounded-3xl px-5'}
            style={{ fontFamily: 'BalooChettan2-Regular' }}
            placeholderTextColor={'#444444bb'}
            maxLength={30}
            returnKeyType='next'
            placeholder='Add a comment...'
          />
        </View>
    </View>
  );
};

export default CommentsModel;
