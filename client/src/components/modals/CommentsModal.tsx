import { VibrancyView } from '@react-native-community/blur';
import React, { useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import { AntDesign } from '../../utils/Icons';
import Text from '../Text';

interface Props {
  comments: { username: string; text: string }[];
}

const CommentsModel = ({ comments }: Props) => {
  const currentUser = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);

  const profileImage = useMemo(() => {
    if (!currentUser) {
      return null;
    }

    if (currentUser.isPet) {
      const currentPet = pets.find((pet) => pet.id === currentUser.id);

      return currentPet && currentPet.ProfilePicture ? currentPet.ProfilePicture.url : null;
    } else {
      return owner && owner.ProfilePicture ? owner.ProfilePicture.url : null;
    }
  }, [currentUser]);

  return (
    <View className='flex w-full bottom-0 absolute shadow-lg pb-4 rounded-t-xl h-[85%] '>
      <View className='absolute w-full h-full -z-10 rounded-t-xl'>
        <VibrancyView
          blurType='chromeMaterialLight'
          blurAmount={30}
          reducedTransparencyFallbackColor='white'
          className='h-full w-full'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: -50,
            right: 0,
            borderRadius: 20,
          }}></VibrancyView>
      </View>

      <View className='flex-row justify-center'>
        <View className='bg-themeText w-16 h-1 rounded-xl mt-2' />
      </View>

      <Text className='text-md font-bold text-center my-3'> 720 Comments</Text>
      <SafeAreaView className='flex-1 relative'>
        <ScrollView className='px-2'>
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
        <View className='absolute top-0 bottom-0 left-0 right-0'>
          <KeyboardAwareScrollView enableAutomaticScroll enableOnAndroid contentContainerStyle={{ flex: 1 }} className='h-full w-full'>
            <View className={'bg-transparent border-t-[.5px] border-gray-400 mt-auto transition-all duration-300 flex-row items-center px-5 pt-3  pb-3'}>
              <Image className='w-10 h-10 rounded-full mr-3' source={{ uri: profileImage || undefined }} />
              <TextInput className='flex-1 h-12 shadow-sm rounded-2xl px-5' placeholderTextColor='#444444bb' maxLength={30} placeholder='Add a comment...' />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CommentsModel;
