import { useLazyQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Post as PostType } from '../../__generated__/graphql';
import Post from '../../components/Post';
import Text from '../../components/Text';
import { GET_ALL_POSTS } from '../../graphql/Post';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralReducer } from '../../redux/reducers/generalReducer';
import { REPLACE_FEED } from '../../redux/constants';

const Feed = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [getAllPosts] = useLazyQuery(GET_ALL_POSTS, { fetchPolicy: 'network-only' });
  const posts = useSelector((state: GeneralReducer) => state.general.feedPosts)

  useEffect(() => {
    getPosts();
  }, [])

  const getPosts = async () => {
    const fetchedPosts = await getAllPosts();

    if (fetchedPosts.data?.getAllPosts.posts) {
      dispatch({ type: REPLACE_FEED, payload: fetchedPosts.data.getAllPosts.posts});
      return;
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    setTimeout(() => {
      getPosts();
      setRefreshing(false);
    }, 600);
  }, [getPosts]);

  return (
    <SafeAreaView className='flex-1 h-full bg-themeBg'>
      <Text className='font-bold text-3xl px-10'>Pet Connect</Text>
      <ScrollView className='w-screen mt-5' refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className='flex justify-center items-center h-full pb-5 px-3'>
          {posts.map((post, i) => {
            return <Post key={i} post={post} />;
          })}
          {posts.length === 0 && (
            <>
              <Text>Nothing to see here...</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feed;
