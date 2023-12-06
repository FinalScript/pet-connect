import React, { useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Post as PostType } from '../__generated__/graphql';
import { options } from '../utils/hapticFeedbackOptions';
import Image from './Image';
import PetTypeImage from './PetTypeImage';
import Text from './Text';
import CommentsModel from './modals/CommentsModal';
import { themeConfig } from '../utils/theme';

interface Props {
  post: PostType;
  goToProfile: () => void;
  onLayoutChange?: (height: number) => void;
}

const comments = [
  {
    username: 'jimmy16',
    text: 'Wow so cute OMG 😍🥹',
  },
  {
    username: 'catwoman',
    text: 'eu, odio. Phasellus at augue id ante dictum cursus. Nunc',
  },
  {
    username: 'bakrsdog',
    text: 'suscipit, est ac facilisis facilisis, magna tellus faucibus leo, in',
  },
];

export default function Post({ post, goToProfile, onLayoutChange }: Props) {
  const [postLiked, setPostLiked] = useState(false);
  const CAPTION_LINES = 2;
  const [moreCaption, setMoreCaption] = useState(false);
  const modalizeRef = useRef<Modalize>(null);
  const [showHeartIcon, setShowHeartIcon] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current; // Ref for the animated value

  const onLayout = (event: { nativeEvent: { layout: { height: number } } }) => {
    const height = event.nativeEvent.layout.height;
    if (onLayoutChange) {
      onLayoutChange(height);
    }
  };

  const openCommentsModal = () => {
    modalizeRef.current?.open();
  };

  const closeCommentsModal = () => {
    modalizeRef.current?.close();
  };

  const animateHeart = () => {
    setShowHeartIcon(true);
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = () => {
    setPostLiked(true);
    trigger(HapticFeedbackTypes.impactLight, options);
  };

  const unlikePost = () => {
    setPostLiked(false);
  };

  const handleMoreCaption = () => {
    if (moreCaption === true) {
      return;
    }
    setMoreCaption(true);
  };

  if (!post.author) {
    return <View></View>;
  }

  return (
    <View className='bg-themeInput mb-5 pb-2 w-full shadow-md shadow-themeActive' onLayout={onLayout}>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition='inside'
          handleStyle={{ backgroundColor: themeConfig.customColors.themeText }}
          scrollViewProps={{ scrollEnabled: false }}
          adjustToContentHeight
          //@ts-expect-error
          keyboardAvoidingBehavior=''
          useNativeDriver>
          <CommentsModel comments={comments} closeModal={() => closeCommentsModal()} />
        </Modalize>
      </Portal>
      <Pressable className='flex-row w-full items-center px-3 py-2' onPress={() => goToProfile()}>
        <View className='w-14 h-14 mr-2 aspect-square'>
          <Image className='flex w-full h-full rounded-lg' source={{ uri: post.author.ProfilePicture?.url }} />
        </View>
        <View className='flex justify-center'>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text className='text-2xl font-semibold text-sky-700 -mb-2'>{post.author.name}</Text>
            <PetTypeImage type={post.author.type} style={{ width: 20, height: 20, marginLeft: 5, marginTop: 5 }} />
          </View>
          <Text className='text-base font-light text-sky-500'>@{post.author.username}</Text>
        </View>
      </Pressable>

      <TapGestureHandler
        onEnded={() => {
          animateHeart();
          handleLike();
        }}
        numberOfTaps={2}>
        <View className='h-[400px] w-full relative flex items-center justify-center'>
          <Image className='w-full h-full object-contain' source={{ uri: post.Media.url }} />
          {showHeartIcon && (
            <Animated.View
              style={{
                position: 'absolute',
                transform: [{ scale: heartScale }],
              }}>
              <AntDesign name='heart' size={100} color={themeConfig.customColors.themeActive} />
            </Animated.View>
          )}
        </View>
      </TapGestureHandler>

      <View className='flex-row items-center gap-x-4 px-4 py-1'>
        <View className='mt-1'>
          {postLiked ? (
            <Pressable onPress={unlikePost}>
              <AntDesign name='heart' size={25} color={themeConfig.customColors.themeActive} />
            </Pressable>
          ) : (
            <Pressable onPress={handleLike}>
              <AntDesign name='hearto' size={25} color={'#000000'} />
            </Pressable>
          )}
        </View>
        <View className='' onTouchEnd={openCommentsModal}>
          <Ionicon name='chatbubble-outline' size={25} color={'#000000'} />
        </View>
      </View>

      {post.description && (
        <View className='px-3 py-1'>
          <View className='flex flex-row min-h-[7rem]'>
            <Text className='text-lg' numberOfLines={moreCaption ? 0 : CAPTION_LINES}>
              <Text className='font-semibold text-sky-600'>{post.author.name} </Text>

              <Text className='text-themeText' onPress={handleMoreCaption} suppressHighlighting>
                {post.description}
              </Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
