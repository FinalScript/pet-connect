import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, Touchable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
    <View
      style={{ shadowColor: themeConfig.customColors.themeText, shadowOpacity: 0.15, shadowRadius: 10 }}
      className='bg-themeInput mb-5 pb-5 pt-2 w-full rounded-[30px]'
      onLayout={onLayout}>
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
      <View className='flex-row justify-between px-5 py-2'>
        <Pressable className='flex-row items-center' onPress={() => goToProfile()}>
          <View className='w-14 h-14 mr-3 aspect-square'>
            <Image className='flex w-full h-full rounded-full' source={{ uri: post.author.ProfilePicture?.url }} />
          </View>
          <View className='flex justify-center'>
            <View className='flex-row'>
              <Text className='text-xl font-bold text-[#694531] -mb-2'>{post.author.name}</Text>
              <PetTypeImage type={post.author.type} style={{ width: 20, height: 20, marginLeft: 8, marginTop: 5 }} />
            </View>
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
            <View className='px-2'>
              <Entypo name='dots-three-horizontal' size={18} color={'#8f5f43'} />
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
              <AntDesign name='heart' size={100} color={'red'} />
            </Animated.View>
          )}
        </View>
      </TapGestureHandler>

      <View className='flex-row items-center gap-x-4 px-5 py-1'>
        <View className='mt-1'>
          {postLiked ? (
            <Pressable onPress={handleUnlike}>
              <AntDesign name='heart' size={25} color={'red'} />
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

      <View className='px-5'>
        <Text className='text-themeText text-base' onPress={handleMoreCaption} suppressHighlighting>
          {likesCount.toLocaleString()} like{likesCount !== 1 && 's'}
        </Text>
      </View>

      {post.description && (
        <View className='px-5'>
          <View className='flex flex-row min-h-[7rem]'>
            <Text className='text-base' numberOfLines={moreCaption ? 0 : CAPTION_LINES}>
              <TouchableWithoutFeedback onPress={() => goToProfile()}>
                <Text className='text-base font-semibold text-[#694531]'>{post.author.name} </Text>
              </TouchableWithoutFeedback>
              <Text className='text-themeText' onPress={handleMoreCaption} suppressHighlighting>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mi erat, aliquam sed vehicula non, lobortis aliquet mi. Interdum et malesuada
                fames ac ante ipsum primis in faucibus.
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

      <Text className='px-5 mt-1 text-xs text-[#838383]'>{getRelativeTime(post.createdAt)}</Text>
    </View>
  );
}
