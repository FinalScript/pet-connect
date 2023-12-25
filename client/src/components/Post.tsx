import { useMutation, useQuery } from '@apollo/client';
import { MenuAction, MenuView } from '@react-native-menu/menu';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, Pressable, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../App';
import { Comment, Post as PostType } from '../__generated__/graphql';
import { deleteFromFirebase } from '../firebase/firebaseStorage';
import { CREATE_COMMENT, GET_COMMENTS_BY_POST_ID } from '../graphql/Comment';
import { DELETE_POST, GET_LIKES_COUNT_OF_POST, IS_LIKING_POST, LIKE_POST, UNLIKE_POST } from '../graphql/Post';
import { ProfileReducer } from '../redux/reducers/profileReducer';
import { getRelativeTime } from '../utils/Date';
import { Entypo, Feather, FontAwesome } from '../utils/Icons';
import { formatNumberWithSuffix } from '../utils/Number';
import { options } from '../utils/hapticFeedbackOptions';
import { themeConfig } from '../utils/theme';
import Image from './Image';
import PetTypeImage from './PetTypeImage';
import Text from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  post: PostType;
  goToProfile: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
}

const CAPTION_LINES = 2;

export default function Post({ post, goToProfile, navigation }: Props) {
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const [moreCaption, setMoreCaption] = useState(false);
  const [showHeartIcon, setShowHeartIcon] = useState(false);
  const modalizeRef = useRef<Modalize>(null);
  const heartScale = useRef(new Animated.Value(0)).current; // Ref for the animated value

  const ownerId = useSelector((state: ProfileReducer) => state.profile.owner?.id);
  const isOwner = useMemo(() => ownerId === post.Author.ownerId, [ownerId, post.Author.Owner?.id]);

  const [deletePost] = useMutation(DELETE_POST, { variables: { id: post.id } });

  const [likePost] = useMutation(LIKE_POST, { variables: { id: post.id } });
  const [unlikePost] = useMutation(UNLIKE_POST, { variables: { id: post.id } });

  const { data: likesCountData, refetch: refetchLikesCountData } = useQuery(GET_LIKES_COUNT_OF_POST, { variables: { id: post.id }, pollInterval: 5000 });
  const likesCount: number = useMemo(() => {
    return likesCountData?.getPostById.post?.likesCount || 0;
  }, [likesCountData]);

  const { data: isLikedData, refetch: refetchIsLikeData } = useQuery(IS_LIKING_POST, { variables: { id: post.id }, pollInterval: 2000 });
  const postLiked: boolean = useMemo(() => isLikedData?.isLikingPost || false, [isLikedData]);

  const { data: commentsData, refetch: refetchCommentData } = useQuery(GET_COMMENTS_BY_POST_ID, { variables: { postId: post.id }, pollInterval: 5000 });
  const comments: Comment[] = useMemo(() => commentsData?.getCommentsByPostId || [], [commentsData]);

  const [createComment] = useMutation(CREATE_COMMENT);
  const [commentInputValue, setCommentInputValue] = useState('');
  const commentInputRef = useRef<TextInput>(null);

  const insets = useSafeAreaInsets();

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

  const handleDelete = useCallback(async () => {
    try {
      await deleteFromFirebase(post.Media.url);
    } catch (err) {
      console.log(err);
    }
    await deletePost();
  }, [deletePost, post]);

  const handleLike = useCallback(async () => {
    if (!postLiked) {
      await likePost().catch((err) => console.log(err));
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

  const renderCommentItem = useCallback(
    ({ item, key }) => {
      return (
        <View key={key} className='mb-4 pl-3 pr-5'>
          <View className='flex-row rounded-lg'>
            <Pressable
              onPress={() => {
                closeCommentsModal();
                navigation.push('Owner Profile', { ownerId: item.Author.id });
              }}>
              <Image className='w-9 h-9 rounded-full mr-3' source={{ uri: item.Author.ProfilePicture?.url }} />
            </Pressable>
            <View className='flex-1 rounded-2xl'>
              <Pressable
                onPress={() => {
                  closeCommentsModal();
                  navigation.push('Owner Profile', { ownerId: item.Author.id });
                }}>
                <Text className='text-xs text-gray-700'>{item.Author.name}</Text>
              </Pressable>
              <Text className='text-sm font-medium text-themeText' numberOfLines={4}>
                {item.text}
              </Text>
              <View className='flex-row items-end justify-between'>
                <Text className='mt-2 text-xs text-[#9c9c9c]'>{getRelativeTime(item.createdAt)}</Text>
                <View className='flex-row items-center gap-1'>
                  <Text className='text-xs text-[#6d6d6d]'>{formatNumberWithSuffix(0)}</Text>
                  <AntDesign name='hearto' size={10} color={'#6d6d6d'} />
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [closeCommentsModal, navigation]
  );

  const commentsModal = useMemo(() => {
    return (
      <Modalize
        ref={modalizeRef}
        handlePosition='inside'
        handleStyle={{ backgroundColor: themeConfig.customColors.themeText }}
        useNativeDriver
        modalStyle={{ backgroundColor: themeConfig.customColors.themeInput }}
        modalHeight={Dimensions.get('screen').height * 0.85}
        HeaderComponent={
          <View className='pt-3'>
            <Text className='text-md font-bold text-center my-3'> {comments.length} Comments</Text>
          </View>
        }
        FooterComponent={
          <View className={'bg-themeInput mb-3 flex-row items-center px-5 pt-3  pb-3'}>
            <Image className='w-10 h-10 rounded-full mr-3' source={{ uri: owner?.ProfilePicture?.url }} />
            <View className='relative flex-1 flex justify-center'>
              <TextInput
                ref={commentInputRef}
                onSubmitEditing={async (e) => {
                  if (e.nativeEvent.text && e.nativeEvent.text.trim().length > 0) {
                    await createComment({ variables: { postId: post.id, text: e.nativeEvent.text.trim() } });
                    commentInputRef.current?.clear();
                    setCommentInputValue('');
                    await refetchCommentData();
                  }
                }}
                value={commentInputValue}
                onChangeText={setCommentInputValue}
                returnKeyType='send'
                returnKeyLabel='Send'
                className='flex-1 h-12 rounded-3xl px-5 pr-10 text-themeText bg-zinc-300'
                placeholderTextColor='#444444bb'
                placeholder='Add a comment...'
                style={{ fontFamily: 'BalooChettan2-Regular' }}
              />
              {commentInputValue && (
                <Pressable
                  onPress={() => {
                    setCommentInputValue('');
                  }}
                  className='pr-5 absolute right-0'>
                  <Feather name='x' size={15} color={themeConfig.customColors.themeText} />
                </Pressable>
              )}
            </View>
          </View>
        }
        keyboardAvoidingBehavior='padding'>
        {comments.map((comment) => {
          return renderCommentItem({ item: comment, key: comment.id });
        })}
      </Modalize>
    );
  }, [comments, commentInputRef, commentInputValue, createComment, modalizeRef, owner, post.id, renderCommentItem, refetchCommentData]);

  const [imageContainerDimensions, setImageContainerDimensions] = useState({ width: 0, height: 0 });

  const onLayoutImageContainer = (event) => {
    const { width, height } = event.nativeEvent.layout;

    if (width && height) {
      console.log(width / height);
      setImageContainerDimensions({ width, height });
    }
  };

  if (!post.Author) {
    return <View></View>;
  }

  return (
    <View className='bg-themeBg relative w-full h-full flex justify-end'>
      <Portal>{commentsModal}</Portal>

      <View className='flex-1 flex justify-end'>
        <TapGestureHandler
          onEnded={() => {
            animateHeart();
            handleLike();
          }}
          numberOfTaps={2}>
          <View className='w-full h-full relative flex items-center justify-center' onLayout={onLayoutImageContainer}>
            {imageContainerDimensions.width > 0 && imageContainerDimensions.height > 0 && (
              <Image
                style={{
                  height: imageContainerDimensions.height,
                  width: imageContainerDimensions.width,
                  aspectRatio: imageContainerDimensions.width / imageContainerDimensions.height,
                }}
                resizeMode='cover'
                source={{ uri: post.Media.url }}
              />
            )}
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
      </View>

      <View className='w-full' style={{ paddingBottom: 80 }}>
        <View className='px-3 pb-5 pt-3 w-full'>
          <View className='flex-row items-center w-full'>
            <View className='flex-1'>
              <View>
                <Pressable className='flex-row items-center' onPress={() => goToProfile()}>
                  <View className='w-10 h-10 mr-2 aspect-square'>
                    <Image className='flex w-full h-full rounded-full border-[1px] border-themeActive' source={{ uri: post.Author.ProfilePicture?.url }} />
                  </View>
                  <View className='flex justify-center'>
                    <View className='flex-row'>
                      <Text className='text-lg font-bold text-[#694531] -mb-2'>{post.Author.name}</Text>
                      <PetTypeImage type={post.Author.type} style={{ width: 20, height: 20, marginLeft: 8, marginTop: 5 }} />
                    </View>
                  </View>
                </Pressable>

                {post.description && (
                  <View className='mt-1'>
                    <View className='flex flex-row min-h-[7rem]'>
                      <Text className='text-sm font-medium' numberOfLines={moreCaption ? 0 : CAPTION_LINES}>
                        <Text className='text-themeText' onPress={handleMoreCaption} suppressHighlighting>
                          {post.description}
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <Text className='mt-2 text-xs text-[#838383]'>{getRelativeTime(post.createdAt)}</Text>
            </View>

            <View className='flex items-center ml-3'>
              <View className='flex items-center mb-2'>
                <Pressable onPress={postLiked ? handleUnlike : handleLike}>
                  <AntDesign name={postLiked ? 'heart' : 'hearto'} size={25} color={postLiked ? 'red' : 'rgba(0, 0, 0, 0.9)'} />
                </Pressable>
                <Text className='text-themeText text-base' onPress={handleMoreCaption} suppressHighlighting>
                  {likesCount.toLocaleString()}
                </Text>
              </View>
              <View className='flex items-center'>
                <Pressable className='' onPress={openCommentsModal}>
                  <Ionicon name={'chatbubble-ellipses-outline'} size={25} color={'rgba(0, 0, 0, 0.9)'} />
                </Pressable>
                <Text className='text-themeText text-base' onPress={handleMoreCaption} suppressHighlighting>
                  {comments.length.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={{ shadowColor: themeConfig.customColors.themeText, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { height: 0, width: 0 } }}
      className='bg-themeInput mb-5 pb-5 pt-2 w-full flex-1 rounded-[30px]'>
      <Portal>{commentsModal}</Portal>
      <View className='flex-row justify-between px-5 py-2'>
        <Pressable className='flex-row items-center' onPress={() => goToProfile()}>
          <View className='w-14 h-14 mr-3 aspect-square'>
            <Image className='flex w-full h-full rounded-full' source={{ uri: post.Author.ProfilePicture?.url }} />
          </View>
          <View className='flex justify-center'>
            <View className='flex-row'>
              <Text className='text-xl font-bold text-[#694531] -mb-2'>{post.Author.name}</Text>
              <PetTypeImage type={post.Author.type} style={{ width: 20, height: 20, marginLeft: 8, marginTop: 5 }} />
            </View>
          </View>
        </Pressable>

        <View className='flex justify-center'>
          <MenuView
            onPressAction={({ nativeEvent }) => {
              if (nativeEvent.event === 'delete') {
                handleDelete();
              }
            }}
            actions={menuActions}>
            <View className=''>
              <Entypo name='dots-three-horizontal' size={20} color={'#8f5f43'} />
            </View>
          </MenuView>
        </View>
      </View>

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

      {comments.length > 0 && (
        <Pressable onPress={openCommentsModal}>
          <Text className='px-5 text-md text-[#4b4b4b]'>
            View {comments.length > 1 && 'all'} {comments.length} comment{comments.length > 1 && 's'}
          </Text>
        </Pressable>
      )}

      {comments[0] && (
        <View className='px-5 mt-1'>
          <View className='flex-row'>
            <Text className='font-semibold text-[#694531]'>{comments[0].Author.name} </Text>

            <Text ellipsizeMode='tail' numberOfLines={1} className='text-themeText w-[50%]' onPress={handleMoreCaption} suppressHighlighting>
              {comments[0].text}
            </Text>
          </View>
        </View>
      )}

      <Text className='px-5 mt-1 text-xs text-[#838383]'>{getRelativeTime(post.createdAt)}</Text>
    </View>
  );
}
