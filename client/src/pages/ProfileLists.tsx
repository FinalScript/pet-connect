import React from 'react';
import { View, Pressable, Text, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import PetTypeImage from '../components/PetTypeImage';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile Lists'>;

const ProfileLists = ({
  route: {
    params: { following },
  },
  navigation,
}: Props) => {
  return (
    <View className='flex-1 justify-center items-center bg-themeBg'>
      {following?.map((pet) => (
        <View key={pet.id} className='flex-row items-center mt-5'>
          <Pressable
            className='h-[80px] flex flex-row flex-1 rounded-2xl bg-themeInput shadow-sm shadow-themeShadow'
            onPress={() => {
              navigation.navigate('Pet Profile', { petId: pet.id });
            }}>
            <View className='w-[80px] aspect-square flex justify-center items-center mr-5 p-1'>
              {pet.ProfilePicture?.url ? (
                <Image className='w-full h-full rounded-xl' source={{ uri: pet.ProfilePicture.url }} />
              ) : (
                <PetTypeImage type={pet.type} className='w-full h-full' />
              )}
            </View>
            <View className='flex justify-center'>
              <Text className='text-2xl -mb-1'>{pet.name}</Text>
              <Text className='text-sm'>@{pet.username}</Text>
            </View>
          </Pressable>
        </View>
      ))}
    </View>
  );
};

export default ProfileLists;
