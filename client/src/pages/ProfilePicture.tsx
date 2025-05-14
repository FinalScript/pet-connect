import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { RootStackParamList } from '../../App';
import Image from '../components/Image';
import { Ionicon } from '../utils/Icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile Picture'>;

const ProfilePicturePage = ({
  route: {
    params: { profilePicture },
  },
}: Props) => {
  return (
    <View className='flex-1 justify-center items-center bg-black'>
      <View className='w-full aspect-square rounded-full flex items-center justify-center '>
        {profilePicture?.url ? <Image className='w-full h-full ' source={{ uri: profilePicture.url }} /> : <Ionicon name='person' size={55} />}
      </View>
    </View>
  );
};

export default ProfilePicturePage;
