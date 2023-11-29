import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, Image, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { getApiBaseUrl } from '../../api';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import Text from '../Text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BlurView, VibrancyView } from '@react-native-community/blur';
import { AntDesign } from '../../utils/Icons';

interface Props {
  comments: { username: string; text: string }[];
  closeModal: () => void;
}

const CommentsModel = ({ comments, closeModal }: Props) => {
  const currentUser = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
    <View className='h-full flex justify-end'>
      <Pressable onPress={() => closeModal()} className='flex-1'></Pressable>
      <View className='flex w-full bottom-0 shadow-lg pb-4 rounded-t-xl h-[85%] bg-themeInput '>
        <View className='flex-row justify-center'>
          <View className='bg-themeText w-16 h-1 rounded-xl mt-2' />
        </View>

        <Text className='text-md font-bold text-center my-3'> 720 Comments</Text>

        <View className='flex-1 relative'>
          <ScrollView className='px-2 flex-1'>
            {comments.map((comment, index) => (
              <View key={`comment-${index}`} className='mb-4 pr-5'>
                <View className='flex-row rounded-lg'>
                  <Image className='w-9 h-9 rounded-full mr-3' source={{ uri: profileImage || undefined }} />
                  <View className='flex-1 rounded-2xl'>
                    <Text className='text-xs text-gray-500'>{comment.username}</Text>
                    <Text className='text-xs font-medium text-themeText' numberOfLines={4}>
                      {comment.text}
                    </Text>
                  </View>
                </View>
                <View className='flex-row items-start justify-end'>
                  <View className='flex-row items-center gap-1'>
                    <Text className='text-xs text-[#6d6d6d]'>1304</Text>
                    <AntDesign name='hearto' size={10} color={'#6d6d6d'} />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className='bg-themeInput bottom-0 absolute w-full border-t-themeText border-t-[.5px]'>
            <View className={'flex-row items-center px-5 pt-3  pb-3'}>
              <Image className='w-10 h-10 rounded-full mr-3' source={{ uri: profileImage || undefined }} />
              <TextInput className='flex-1 h-12 rounded-2xl px-5' placeholderTextColor='#444444bb' maxLength={30} placeholder='Add a comment...' />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CommentsModel;
