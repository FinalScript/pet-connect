import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import Post from '../../components/Post';

const Feed = () => {
  return (
    <SafeAreaView className='h-full bg-themeBg'  >
      <Text className='text-4xl font-bold ' style={{ fontFamily: 'BalooChettan2-Regular' }}>PetConnect</Text>
      <View>
        <Text>Stories</Text>
      </View>
      <View className='flex justify-center items-center h-full'>
        <Post name='' petImage='' postImage='' caption='' likes='' />
      </View>
    </SafeAreaView>
  );
};

export default Feed;
