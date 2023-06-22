import { Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from './Text';
import Icon from 'react-native-vector-icons/FontAwesome';
import { trigger, HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { options } from '../utils/hapticFeedbackOptions';
import DoubleTap from './DoubleTap';

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

  function handleLike() {
    setPostLiked(!postLiked);
  }

  function handleMoreCaption() {
    if (moreCaption === true) {
      return;
    }
    setMoreCaption(true);
  }

  useEffect(() => {
    if (postLiked) {
      trigger(HapticFeedbackTypes.impactLight, options);
      return;
    }
  }, [postLiked]);

  return (
    <View className='px-2 mb-3 w-full shadow-sm shadow-gray-400 '>
      <View className='bg-white mb-3'>
        <View className='px-2'>
          <View className='flex-row w-52 h-10 items-center'>
            <View className='w-8 mr-1 aspect-square'>
              <Image className='flex w-full h-full rounded-full' source={require('../../assets/img/catphoto.jpeg')} />
            </View>
            <View className='justify-center h-full'>
              <Text className='text-xl font-semibold text-sky-600 h-6 flex'>{name}</Text>
              <Text className='text-sm font-light text-sky-600'>{username}</Text>
            </View>
          </View>
        </View>

        <View className='h-[0.5px] bg-gray-300'></View>

        <View className='justify-start items-center'>
          <DoubleTap
            onDoubleTap={() => {
              setPostLiked(true);
            }}>
            <View className='w-full aspect-[3/4] justify-center items-center'>
              {/* postImage would be used in source below */}
              <Image className='flex w-full h-full' source={require('../../assets/img/catphoto.jpeg')} />
            </View>
          </DoubleTap>
        </View>

        <View className='mx-2 gap-y-2 mb-3'>
          <View className='flex-row gap-x-5 pt-2'>
            <View className='mt-1' onTouchEnd={handleLike}>
              {postLiked === true ? <Icon name='heart' size={40} color={'#ff1000'} /> : <Icon name='heart-o' size={40} color={'#000000'} />}
            </View>
            <View className=''>
              <Icon name='comment-o' size={40} color={'#000000'} />
            </View>
          </View>

          {!caption?.trim() ? (
            ''
          ) : (
            <View className='flex-row max-w-full min-h-[7rem]'>
              <Text className='text-xl leading-5' numberOfLines={moreCaption ? 0 : CAPTION_LINES}>
                <Text className='font-semibold'>{name} </Text>

                <Text onPress={handleMoreCaption} suppressHighlighting>
                  {caption}
                </Text>
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
