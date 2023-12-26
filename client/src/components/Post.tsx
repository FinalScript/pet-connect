import { useMutation, useQuery } from '@apollo/client';
import { MenuAction, MenuView } from '@react-native-menu/menu';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Platform, Pressable, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Gesture, GestureDetector, TapGestureHandler } from 'react-native-gesture-handler';
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
import Toast from 'react-native-toast-message';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

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

  const commentsModalRef = useRef<Modalize>(null);
  const contextModalRef = useRef<Modalize>(null);

  const openCommentsModal = useCallback(() => {
    commentsModalRef.current?.open();
  }, [commentsModalRef]);

  const closeCommentsModal = useCallback(() => {
    commentsModalRef.current?.close();
  }, [commentsModalRef]);

  const openContextModal = useCallback(() => {
    contextModalRef.current?.open();
  }, [contextModalRef]);

  const closeContextModal = useCallback(() => {
    contextModalRef.current?.close();
  }, [contextModalRef]);

  const insets = useSafeAreaInsets();

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
        ref={commentsModalRef}
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
        {comments.length === 0 && <Text className='text-center text-lg text-themeText'>Be the first to comment!</Text>}
        {comments.map((comment) => {
          return renderCommentItem({ item: comment, key: comment.id });
        })}
      </Modalize>
    );
  }, [comments, commentInputRef, commentInputValue, createComment, commentsModalRef, owner, post.id, renderCommentItem, refetchCommentData]);

  const [savingImageLoading, setSavingImageLoading] = useState(false);

  const contextModal = useMemo(() => {
    return (
      <Modalize
        ref={contextModalRef}
        handlePosition='inside'
        handleStyle={{ backgroundColor: themeConfig.customColors.themeText }}
        useNativeDriver
        modalStyle={{ backgroundColor: themeConfig.customColors.themeInput }}
        adjustToContentHeight
        withHandle={false}
        HeaderComponent={
          <View className='flex-row justify-center gap-x-5 pb-14 pt-5 px-5'>
            <Pressable
              className='flex items-center'
              onPress={() => {
                // TODO
              }}>
              <View className='rounded-full p-2 aspect-square bg-themeBtn'>
                <Ionicon name='share-social' size={20} color={themeConfig.customColors.themeText} />
              </View>
              <Text className='mt-1'>Share</Text>
            </Pressable>

            <Pressable
              disabled={savingImageLoading}
              className='flex items-center'
              onPress={() => {
                setSavingImageLoading(true);

                setTimeout(() => {
                  CameraRoll.save(post.Media.url, { type: 'photo' })
                    .then(() => {
                      trigger(HapticFeedbackTypes.notificationSuccess, options);
                      Toast.show({
                        type: 'success',
                        text1: 'Saved image to gallery.',
                        position: 'top',
                        topOffset: 10 + insets.top,
                        text1Style: { fontFamily: 'BalooChettan2-Regular' },
                      });
                    })
                    .catch((err) => {
                      trigger(HapticFeedbackTypes.notificationError, options);
                      Toast.show({
                        type: 'error',
                        text1: 'An error occured when saving image.',
                        position: 'top',
                        topOffset: 10 + insets.top,
                        text1Style: { fontFamily: 'BalooChettan2-Regular' },
                      });
                    })
                    .finally(() => {
                      setSavingImageLoading(false);
                    });
                }, 500);
              }}>
              <View className='rounded-full p-2 aspect-square bg-themeBtn'>
                {savingImageLoading ? (
                  <ActivityIndicator animating={true} color={themeConfig.customColors.themeText} />
                ) : (
                  <Feather name='download' size={20} color={themeConfig.customColors.themeText} />
                )}
              </View>
              <Text className='mt-1'>Save</Text>
            </Pressable>

            <Pressable
              className='flex items-center'
              onPress={() => {
                closeContextModal();

                setTimeout(() => {
                  trigger(HapticFeedbackTypes.notificationSuccess, options);
                  Toast.show({
                    type: 'info',
                    text1: 'Your report has been sent!',
                    position: 'top',
                    topOffset: 10 + insets.top,
                    text1Style: { fontFamily: 'BalooChettan2-Regular' },
                  });
                }, 500);
              }}>
              <View className='rounded-full p-2 aspect-square bg-themeBtn'>
                <Ionicon name='flag' size={20} color={themeConfig.customColors.themeText} />
              </View>
              <Text className='mt-1'>Report</Text>
            </Pressable>

            {isOwner && (
              <Pressable
                className='flex items-center'
                onPress={() => {
                  handleDelete()
                    .then(() => {
                      trigger(HapticFeedbackTypes.notificationSuccess, options);
                      Toast.show({
                        type: 'success',
                        text1: 'Post deleted!',
                        position: 'top',
                        topOffset: 10 + insets.top,
                        text1Style: { fontFamily: 'BalooChettan2-Regular' },
                      });
                    })
                    .catch((err) => {
                      trigger(HapticFeedbackTypes.notificationError, options);
                      Toast.show({
                        type: 'error',
                        text1: 'An error occured when deleting the post.',
                        position: 'top',
                        topOffset: 10 + insets.top,
                        text1Style: { fontFamily: 'BalooChettan2-Regular' },
                      });
                    });
                  closeContextModal();
                }}>
                <View className='rounded-full p-2 aspect-square bg-themeBtn'>
                  <Ionicon name='trash-outline' size={20} color={themeConfig.customColors.themeText} />
                </View>
                <Text className='mt-1'>Delete</Text>
              </Pressable>
            )}
          </View>
        }></Modalize>
    );
  }, [contextModalRef, isOwner, savingImageLoading, post.Media.url, handleDelete, closeContextModal, insets.top]);

  const [imageContainerDimensions, setImageContainerDimensions] = useState({ width: 0, height: 0 });

  const onLayoutImageContainer = (event) => {
    const { width, height } = event.nativeEvent.layout;

    if (width && height) {
      setImageContainerDimensions({ width, height });
    }
  };

  if (!post.Author) {
    return <View></View>;
  }

  const longPress = Gesture.LongPress().onStart(() => {
    trigger(HapticFeedbackTypes.rigid, options);
    openContextModal();
  });

  return (
    <GestureDetector gesture={longPress}>
      <View className='bg-themeBg relative w-full h-full flex justify-end'>
        <Portal>
          {commentsModal}
          {contextModal}
        </Portal>

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
    </GestureDetector>
  );
}
