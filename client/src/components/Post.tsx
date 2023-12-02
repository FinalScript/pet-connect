import React, { useCallback, useState } from 'react';
import { Modal, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Post as PostType } from '../__generated__/graphql';
import { options } from '../utils/hapticFeedbackOptions';
import Text from './Text';
import CommentsModel from './modals/CommentsModal';
import Image from './Image';

interface Props {
  post: PostType;
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

export default function Post({ post }: Props) {
  const [postLiked, setPostLiked] = useState(false);
  const CAPTION_LINES = 2;
  const [moreCaption, setMoreCaption] = useState(false);
  const [modal, setModal] = useState({ comments: false });

  const setCommentsModalVisible = useCallback((bool: boolean) => {
    setModal((prev) => {
      return { ...prev, comments: bool };
    });
  }, []);

  const openCommentsModal = () => {
    setCommentsModalVisible(true);
  };

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
    <View className='bg-white mb-5 pb-2 w-full shadow-sm shadow-themeShadow rounded-2xl'>
      <View className='flex-row w-full items-center px-3 py-2'>
        <Modal
          style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
          presentationStyle='pageSheet'
          visible={modal.comments}
          animationType='slide'
          transparent
          onRequestClose={() => {
            setCommentsModalVisible(false);
          }}>
          <CommentsModel comments={comments} closeModal={() => setCommentsModalVisible(false)} />
        </Modal>
        <View className='w-14 h-14 mr-2 aspect-square'>
          <Image className='flex w-full h-full rounded-full' source={{ uri: post.author.ProfilePicture?.url }} />
        </View>
        <View className='flex justify-center'>
          <Text className='text-2xl font-semibold text-sky-700 -mb-2'>{post.author.name}</Text>
          <Text className='text-base font-light text-sky-500'>@{post.author.username}</Text>
        </View>
      </View>

      <TapGestureHandler
        onEnded={() => {
          if (!postLiked) {
            handleLike();
          }
        }}
        numberOfTaps={2}>
        <View className='w-full h-[400px]'>
          {/* postImage would be used in source below */}
          <Image className='flex w-full h-full' source={{ uri: post.Media.url }} />
        </View>
      </TapGestureHandler>

      <View className='flex flex-row items-center gap-x-4 px-4 py-1'>
        <View className='mt-1' onTouchEnd={handleLike}>
          {postLiked === true ? <AntDesign name='heart' size={25} color={'#ff1000'} /> : <AntDesign name='hearto' size={25} color={'#000000'} />}
        </View>
        <View className='' onTouchEnd={openCommentsModal}>
          <Ionicon name='chatbubble-outline' size={25} color={'#000000'} />
        </View>
      </View>

      <View className='px-3 py-1'>
        {post.description && (
          <View className='flex flex-row min-h-[7rem]'>
            <Text className='text-lg' numberOfLines={moreCaption ? 0 : CAPTION_LINES}>
              <Text className='font-semibold text-sky-600'>{post.author.name} </Text>

              <Text className='text-themeText' onPress={handleMoreCaption} suppressHighlighting>
                {post.description}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
