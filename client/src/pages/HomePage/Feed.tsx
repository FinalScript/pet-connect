import { useState, useEffect, useCallback } from 'react';
import { View, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import React from 'react';
import Post from '../../components/Post';
import Text from '../../components/Text';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../../graphql/Post';

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [getAllPosts] = useLazyQuery(GET_ALL_POSTS);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllPosts().then(({ data }) => {
      if (data?.getAllPosts && data?.getAllPosts.posts.length > 0) {
        console.log(data.getAllPosts.posts, posts)
        // setPosts(data.getAllPosts.posts);
      }
    });

    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const pictures = await (await fetch('https://api.thecatapi.com/v1/images/search?limit=10')).json();

    pictures.forEach(async (picture: any) => {
      const quote = await fetch('https://dummyjson.com/quotes/random');

      const parsed = (await quote.json()).quote;

      setPosts((prev) => {
        return [...prev, { picture, quote: parsed }];
      });
    });
  };

  return (
    <SafeAreaView className='flex-1 h-full bg-themeBg'>
      <Text className='font-bold text-3xl px-10'>Pet Connect</Text>
      <ScrollView className='w-screen mt-5' refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className='flex justify-center items-center h-full pb-5 px-3'>
          {posts.map((post, i) => {
            return <Post key={i} name='Pet Connect' username='catnip.lover' caption={post.quote} petImage={undefined} postImage={{ uri: post.picture.url }} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feed;
