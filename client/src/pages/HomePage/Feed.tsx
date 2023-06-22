import { View, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import Post from '../../components/Post';
import Text from '../../components/Text';

const Feed = () => {
  return (
    <SafeAreaView className='h-full bg-themeBg'>
      <ScrollView className=''>
        <View className='px-2 z-50 '>
          <Text className='text-4xl font-bold'>PetConnect</Text>
          <Text>Stories</Text>
        </View>

        <View className='flex justify-center items-center h-full'>
          <View className='mb-3'>
            <Post name='Mittens' petImage='' postImage='' caption='Out in the park and having a good time!Out in the park and having a good time!Out in the park and having a good time!' />
            <Post name='Whiskers' petImage='' postImage='' caption='' />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feed;
