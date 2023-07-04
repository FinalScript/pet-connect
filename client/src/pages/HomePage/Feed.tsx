import { View, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import Post from '../../components/Post';
import Text from '../../components/Text';

const Feed = () => {
  return (
    <SafeAreaView className='flex-1 h-full items-center bg-themeBg'>
      <ScrollView className='w-screen'>
        <Text className='font-bold text-3xl px-10'>Pet Connect</Text>

        <View className='flex justify-center items-center h-full pb-5 px-3'>
          <Post
            name='Mittens'
            username='mittens123'
            petImage=''
            postImage=''
            caption='Out in the park and having a good time!Out in the park and having a good time!Out in the park and having a good time!'
          />
          <Post name='Whiskers' username='catnip.lover' petImage={undefined} postImage={undefined} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feed;
