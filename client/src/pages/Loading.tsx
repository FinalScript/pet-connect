import { SafeAreaView, ActivityIndicator } from 'react-native';
import React from 'react';

const Loading = () => {
  return (
    <SafeAreaView className='h-full w-full bg-themeBg flex justify-center items-center'>
      <ActivityIndicator size='small' color={'#321411'} />
    </SafeAreaView>
  );
};

export default Loading;
