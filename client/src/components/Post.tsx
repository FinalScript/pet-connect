import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Comment, Post as PostType } from '../__generated__/graphql';
import { options } from '../utils/hapticFeedbackOptions';
import Image from './Image';
import PetTypeImage from './PetTypeImage';
import Text from './Text';
import CommentsModel from './modals/CommentsModal';
import { themeConfig } from '../utils/theme';
import { Entypo } from '../utils/Icons';
import { Divider, Menu } from 'react-native-paper';
import { MenuAction, MenuView } from '@react-native-menu/menu';
import { useSelector } from 'react-redux';
import { ProfileReducer } from '../redux/reducers/profileReducer';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_POST, GET_LIKES_COUNT_OF_POST, IS_LIKING_POST, LIKE_POST, UNLIKE_POST } from '../graphql/Post';
import { GET_COMMENTS_BY_POST_ID } from '../graphql/Comment';
import { getRelativeTime } from '../utils/Date';
import { formatNumberWithSuffix } from '../utils/Number';

interface Props {
  post: PostType;
  goToProfile: () => void;
  onLayoutChange?: (height: number) => void;
}

const CAPTION_LINES = 2;

export default function Post({ post, goToProfile, onLayoutChange }: Props) {
  const [moreCaption, setMoreCaption] = useState(false);
  const [showHeartIcon, setShowHeartIcon] = useState(false);
  const modalizeRef = useRef<Modalize>(null);
  const heartScale = useRef(new Animated.Value(0)).current; // Ref for the animated value

  const ownerId = useSelector((state: ProfileReducer) => state.profile.owner?.id);
  const isOwner = useMemo(() => ownerId === post.author.ownerId, [ownerId, post.author.Owner?.id]);

  const [deletePost] = useMutation(DELETE_POST, { variables: { id: post.id } });

  const [likePost] = useMutation(LIKE_POST, { variables: { id: post.id } });
  const [unlikePost] = useMutation(UNLIKE_POST, { variables: { id: post.id } });

  const { data: likesCountData, refetch: refetchLikesCountData } = useQuery(GET_LIKES_COUNT_OF_POST, { variables: { id: post.id }, pollInterval: 5000 });
  const likesCount: number = useMemo(() => likesCountData?.getPostById.post?.likesCount || 0, [likesCountData]);

  const { data: isLikedData, refetch: refetchIsLikeData } = useQuery(IS_LIKING_POST, { variables: { id: post.id } });
  const postLiked: boolean = useMemo(() => isLikedData?.isLikingPost || false, [isLikedData]);

  const { data: commentsData, refetch: refetchCommentData } = useQuery(GET_COMMENTS_BY_POST_ID, { variables: { postId: post.id }, pollInterval: 5000 });
  const comments: Comment[] = useMemo(() => commentsData?.getCommentsByPostId || [], [commentsData]);

  const menuActions: MenuAction[] = useMemo(() => {
    const actions: MenuAction[] = [
      {
        id: 'share',
        title: 'Share',
        titleColor: '#46F289',
        subtitle: 'Share',
        image: Platform.select({
          ios: 'square.and.arrow.up',
          android: 'ic_menu_share',
        }),
      },
    ];

    if (isOwner) {
      actions.push({
        id: 'delete',
        title: 'Delete',
        attributes: {
          destructive: true,
        },
        image: Platform.select({
          ios: 'trash',
          android: 'ic_menu_delete',
        }),
      });
    }

    return actions;
  }, [isOwner, ownerId]);

  useEffect(() => {
    console.log(post.id);
  }, [post]);

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

  const handleLike = useCallback(async () => {
    if (!postLiked) {
      await likePost();
      await refetchIsLikeData();
      await refetchLikesCountData();
      trigger(HapticFeedbackTypes.impactLight, options);
    }
  }, [likePost]);

  const handleUnlike = useCallback(async () => {
    await unlikePost();
    await refetchIsLikeData();
    await refetchLikesCountData();
  }, [unlikePost]);

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
    <View className='bg-themeInput mb-5 pb-2 w-full border-t-[.2px] border-b-[.2px] border-gray-600' onLayout={onLayout}>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition='inside'
          handleStyle={{ backgroundColor: themeConfig.customColors.themeText }}
          scrollViewProps={{ scrollEnabled: false }}
          adjustToContentHeight
          //@ts-expect-error
          keyboardAvoidingBehavior=''
          propagateSwipe={true}
          useNativeDriver>
          <CommentsModel postId={post.id} comments={comments} closeModal={() => closeCommentsModal()} refetchComments={refetchCommentData} />
        </Modalize>
      </Portal>
      <View className='flex-row justify-between items-center px-3 py-2'>
        <Pressable className='flex-row items-center ' onPress={() => goToProfile()}>
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

        <View>
          <MenuView
            onPressAction={({ nativeEvent }) => {
              if (nativeEvent.event === 'delete') {
                deletePost();
              }
            }}
            actions={menuActions}>
            <View className='pr-3'>
              <Entypo name='dots-three-horizontal' size={18} />
            </View>
          </MenuView>
        </View>
      </View>

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
            <Pressable onPress={handleUnlike}>
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

      <View className='px-3'>
        <Text className='text-themeText font-base text-lg' onPress={handleMoreCaption} suppressHighlighting>
          {likesCount.toLocaleString()} like{likesCount !== 1 && 's'}
        </Text>
      </View>

      {post.description && (
        <View className='px-3'>
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

      {comments.length > 0 && (
        <Pressable onPress={openCommentsModal}>
          <Text className='px-3 text-md text-[#4b4b4b]'>
            View {comments.length > 1 && 'all'} {comments.length} comment{comments.length > 1 && 's'}
          </Text>
        </Pressable>
      )}

      <Text className='px-3 mt-1 text-xs text-[#838383]'>{getRelativeTime(post.createdAt)}</Text>
    </View>
  );
}
