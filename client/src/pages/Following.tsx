import React, { useEffect } from 'react';
import { View, Pressable, Text, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import PetTypeImage from '../components/PetTypeImage';
import Image from '../components/Image';

type Props = NativeStackScreenProps<RootStackParamList, 'Following'>;

const Following = ({
  route: {
    params: { following },
  },
  navigation,
}: Props) => {
  return (
    <SafeAreaView className='flex-1 items-center bg-themeBg'>
      {following?.map((pet) => (
        <View key={pet.id} className='flex-row items-center mt-5'>
          <Pressable
            className='h-[80px] flex flex-row flex-1 rounded-2xl bg-themeInput shadow-sm shadow-themeShadow'
            onPress={() => {
              navigation.push('Pet Profile', { petId: pet.id });
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
    </SafeAreaView>
  );
};

export default Following;
