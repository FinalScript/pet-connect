import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicon } from '../../utils/Icons';
import Text from '../../components/Text';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
}

const Inbox = ({ navigation }: Props) => {

  return (
    <SafeAreaView className='bg-themeBg h-full w-full p-5 flex flex-col flew-grow'>
      <View className='flex flex-row items-center justify-between mb-4'>
        <View className='flex justify-center items-center flex-grow'>
          <Text className='text-center text-2xl font-bold pl-12'>My Inbox</Text>
        </View>
        <TouchableOpacity
          className='rounded-full bg-themeActive p-2 mr-4' 
          onPress={() => {
            navigation.push('Friend List');
          }}
        >
          <Ionicon name="add" size={24} color="#8f5f43" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Inbox;
