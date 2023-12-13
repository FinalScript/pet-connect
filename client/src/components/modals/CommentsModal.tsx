import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useKeyboard } from '../../hooks/useKeyboard';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import { AntDesign } from '../../utils/Icons';
import Text from '../Text';
import Image from '../Image';
import { Comment, Exact, GetCommentsByPostIdQuery } from '../../__generated__/graphql';
import { ApolloQueryResult, useMutation } from '@apollo/client';
import { CREATE_COMMENT } from '../../graphql/Comment';

interface Props {
  postId: string;
  comments: Comment[];
  closeModal: () => void;
  refetchComments: (
    variables?:
      | Partial<
          Exact<{
            postId: string;
          }>
        >
      | undefined
  ) => Promise<ApolloQueryResult<GetCommentsByPostIdQuery>>;
}

const CommentsModel = ({ postId, comments, closeModal, refetchComments }: Props) => {
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const keyboardHeight = useKeyboard();
  const inputAnimatedValue = new Animated.Value(0);
  const [createComment] = useMutation(CREATE_COMMENT);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(inputAnimatedValue, {
      toValue: -keyboardHeight + 10,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [keyboardHeight]);

  return (
    <View style={{ height: Dimensions.get('screen').height * 0.85 }} className='flex w-full h-full pb-4 pt-5 rounded-t-xl bg-themeBg'>
      <Text className='text-md font-bold text-center my-3'> 720 Comments</Text>
      <View className='flex-1'>
        <ScrollView className='px-2'>
          {comments.map((comment, index) => (
            <View key={`comment-${index}`} className='mb-4 pr-5'>
              <View className='flex-row rounded-lg'>
                <Image className='w-9 h-9 rounded-full mr-3' source={{ uri: comment.author.ProfilePicture?.url }} />
                <View className='flex-1 rounded-2xl'>
                  <Text className='text-xs text-gray-600'>{owner?.id === comment.author.id ? 'You' : comment.author.name}</Text>
                  <Text className='text-sm font-medium text-themeText' numberOfLines={4}>
                    {comment.text}
                  </Text>
                </View>
              </View>
              {/* <View className='flex-row items-start justify-end'>
                <View className='flex-row items-center gap-1'>
                  <Text className='text-xs text-[#6d6d6d]'>1304</Text>
                  <AntDesign name='hearto' size={10} color={'#6d6d6d'} />
                </View>
              </View> */}
            </View>
          ))}
        </ScrollView>
      </View>
      <Animated.View className={'absolute w-full bottom-0 pb-4 bg-themeInput'} style={{ transform: [{ translateY: inputAnimatedValue }] }}>
        <View className={'border-t-[.5px] border-gray-400 flex-row items-center px-5 pt-3  pb-3'}>
          <Image className='w-10 h-10 rounded-full mr-3' source={{ uri: owner?.ProfilePicture?.url }} />
          <TextInput
            ref={inputRef}
            clearButtonMode='always'
            onSubmitEditing={async (e) => {
              if (e.nativeEvent.text && e.nativeEvent.text.length > 0) {
                await createComment({ variables: { postId, text: e.nativeEvent.text } });
                inputRef.current?.clear();
                await refetchComments();
              }
            }}
            returnKeyType='send'
            returnKeyLabel='Send'
            className='flex-1 h-12 shadow-sm rounded-2xl px-5'
            placeholderTextColor='#444444bb'
            maxLength={30}
            placeholder='Add a comment...'
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default CommentsModel;
