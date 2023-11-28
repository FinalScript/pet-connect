import React from 'react';
import { Image, SafeAreaView, TextInput, View } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { getApiBaseUrl } from '../../api';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import Text from '../Text';

interface Props {
  comments: { text: string }[];
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
    <View className={`flex w-full bottom-0 absolute shadow-lg px-5 pb-7 rounded-t-xl bg-themeBg h-[85%]`}>
      <View className='flex-row justify-center'>
        <View className='bg-themeText w-16 h-1 rounded-xl mt-2'></View>
      </View>
      <Text className='text-2xl font-bold text-center my-3'>Comments</Text>
      <SafeAreaView className='flex h-full'>
        <View className='flex'>
          {comments.map((comment, i) => {
            return (
              <View key={i}>
                <Text>{comment.text}</Text>
              </View>
            );
          })}
        </View>
        <View className='flex-row items-center mt-auto px-5 py-3 mb-5'>
          {profileImage ? (
            <Image style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} source={{ uri: profileImage }} />
          ) : (
            <Ionicon name='person' size={50} style={{ opacity: 0.8, marginRight: 10 }} />
          )}
          <TextInput
            className={'flex-1 h-full border-transparent bg-themeInput border-[5px] shadow-sm shadow-themeShadow rounded-3xl px-5'}
            style={{ fontFamily: 'BalooChettan2-Regular' }}
            placeholderTextColor={'#444444bb'}
            maxLength={30}
            returnKeyType='next'
            placeholder='Add a comment...'
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CommentsModel;
