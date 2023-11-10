import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { Ionicon } from '../../utils/Icons';
import { HomeStackParamList } from './HomeNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'PostPage'>;

const PostPage = ({ navigation }: Props) => {
  return (
    <SafeAreaView className='h-full w-full bg-themeBg'>
      <View className='px-5 flex flex-col items-start'>
        <PressableOpacity
          className='p-4'
          onPress={() => {
            navigation.goBack();
          }}
          disabledOpacity={0.4}>
          <Ionicon name='ios-close' color='black' size={30} />
        </PressableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostPage;
