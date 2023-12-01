import { useLazyQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Post as PostType } from '../../__generated__/graphql';
import Post from '../../components/Post';
import Text from '../../components/Text';
import { GET_ALL_POSTS } from '../../graphql/Post';

const Feed = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [getAllPosts] = useLazyQuery(GET_ALL_POSTS, { fetchPolicy: 'network-only' });

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const fetchedPosts = await getAllPosts();

    if (fetchedPosts.data?.getAllPosts.posts) {
      setPosts(fetchedPosts.data.getAllPosts.posts);
      return;
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getPosts();

    setTimeout(() => {
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feed;
