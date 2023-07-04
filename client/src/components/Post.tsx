import { Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from './Text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { trigger, HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { options } from '../utils/hapticFeedbackOptions';
import { Gesture, GestureDetector, TapGestureHandler } from 'react-native-gesture-handler';

interface Props {
  name: string | undefined;
  username: string | undefined;
  petImage: any;
  postImage: any;
  caption?: string | undefined;
}

export default function Post({ name, username, petImage, postImage, caption }: Props) {
  const [postLiked, setPostLiked] = useState(false);
  const CAPTION_LINES = 2;
  const [moreCaption, setMoreCaption] = useState(false);

  const handleLike = () => {
    if (!postLiked) {
      trigger(HapticFeedbackTypes.impactLight, options);
    }
    setPostLiked((prev) => !prev);
  };

  const handleMoreCaption = () => {
    if (moreCaption === true) {
      return;
    }
    setMoreCaption(true);
  };

  return (
    <View className='bg-white mb-3 w-full shadow-sm shadow-themeShadow rounded-md'>
      <View className='flex-row w-full items-center px-3 py-2'>
        <View className='w-14 h-14 mr-2 aspect-square'>
          <Image className='flex w-full h-full rounded-full' source={require('../../assets/img/catphoto.jpeg')} />
        </View>
        <View className='flex justify-center'>
          <Text className='text-2xl font-semibold text-sky-700 -mb-2'>{name}</Text>
          <Text className='text-base font-light text-sky-500'>{username}</Text>
        </View>
      </View>

      <TapGestureHandler
        onEnded={() => {
          if (!postLiked) {
            handleLike();
          }
        }}
        numberOfTaps={2}>
        <View className='w-full aspect-[3/4] justify-center items-center'>
          {/* postImage would be used in source below */}
          <Image className='flex w-full h-full' source={require('../../assets/img/catphoto.jpeg')} />
        </View>
      </TapGestureHandler>

      <View className='flex flex-row items-center gap-x-4 px-4 py-1'>
        <View className='mt-1' onTouchEnd={handleLike}>
          {postLiked === true ? <AntDesign name='heart' size={25} color={'#ff1000'} /> : <AntDesign name='hearto' size={25} color={'#000000'} />}
        </View>
        <View className=''>
          <Ionicon name='chatbubble-outline' size={25} color={'#000000'} />
        </View>
      </View>

      <View className='px-3 py-1'>
        {!caption?.trim() ? (
          ''
        ) : (
          <View className='flex flex-row min-h-[7rem]'>
            <Text className='text-lg leading-5' numberOfLines={moreCaption ? 0 : CAPTION_LINES}>
              <Text className='font-semibold'>{name} </Text>

              <Text onPress={handleMoreCaption} suppressHighlighting>
                {caption}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
