import { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import Post from '../../components/Post';
import Text from '../../components/Text';

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);

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
    <SafeAreaView className='flex-1 h-full items-center bg-themeBg'>
      <ScrollView className='w-screen'>
        <Text className='font-bold text-3xl px-10'>Pet Connect</Text>

        <View className='flex justify-center items-center h-full pb-5 px-3'>
          {posts.map((post, i) => {
            return (
              <Post key={i} name='Whiskers' username='catnip.lover' caption={post.quote} petImage={undefined} postImage={{ uri: post.picture.url }} />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feed;
