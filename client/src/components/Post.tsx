import { Image, View } from 'react-native';
import React from 'react';
import Text from './Text';

interface Props {
  name: string | undefined;
  petImage: any;
  postImage: any;
  caption: string | undefined;
}

export default function Post({ name, petImage, postImage, caption }: Props) {
  return (
    <View className='px-2 mb-5 w-full shadow-sm shadow-gray-400 '>
      <View className='bg-white mb-2'>

        <View className='px-2'>
          <View className='flex-row w-52 h-10 items-center'>
            <View className='w-10 h-10 mr-1'>{petImage}</View>
            <Text className='text-lg font-semibold text-sky-600'>{name}</Text>
          </View>
        </View>

        <View className='h-[0.5px] bg-gray-300'></View>

        <View className='justify-start items-center'>
          <View className='w-full aspect-[3/4] justify-center items-center'>
            <Image className='flex w-full h-full' source={require('../../assets/img/catphoto.jpeg')} />
          </View>
        </View>

        <View className='mx-2 gap-y-2'>
          <View className='flex-row gap-x-2 pt-2'>
            <View className='w-12 h-12 justify-center'>
              <Text className='text-2xl'>Like</Text>
            </View>
            <View className='w-12 h-12 justify-center'>
              <Text className='text-2xl'>cmt</Text>
            </View>
          </View>

          <View className='flex-row max-w-full h-28 gap-x-1 border border-red-500 break-words'>
            <Text className='text-xl font-semibold'>{name}</Text>
            <Text className='text-xl min-h-0'>{caption}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
