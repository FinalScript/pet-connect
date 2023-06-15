import { View, Text } from 'react-native';
import React from 'react';

interface Props {
  name: string | undefined;
  petImage: string | undefined;
  postImage: string | undefined;
  caption: string | undefined;
  likes: string | undefined;
}

export default function Post({ name, petImage, postImage, caption, likes }: Props) {
  return (
    <View className='bg-white w-[370px] border border-gray-900 shadow-sm'>
      <View className='mx-3 mb-2 gap-y-1'>

        <View className='flex-row border border-emerald-500 w-52 h-10 items-center'>
            <View className='border border-yellow-500 w-10 h-10 mr-1'>{petImage}</View>
            <Text className='text-lg text-sky-600'>{name}</Text>
        </View>

        <View className='justify-start items-center'>
          <View className='w-full h-[330px] justify-center items-center border'>{postImage}</View>
        </View>

        <View className='border border-blue-500 w-full h-32'>
          <Text className='text-xl' style={{ fontFamily: 'BalooChettan2-Regular' }}>
            {caption}
          </Text>
        </View>

        <View className=''>
          <View className='border border-red-500 w-40 h-10 justify-center'>
            <Text className='text-2xl' style={{ fontFamily: 'BalooChettan2-Regular' }}>
              {likes}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
