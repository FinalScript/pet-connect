import React from 'react';
import { View, Pressable, Text, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import PetTypeImage from '../components/PetTypeImage';
import { Owner } from '../__generated__/graphql';
import { Ionicon } from '../utils/Icons';
import Image from '../components/Image';

type Props = NativeStackScreenProps<RootStackParamList, 'Followers'>;

const Followers = ({
  route: {
    params: { followers },
  },
  navigation,
}: Props) => {
    console.log(followers)
  return (
    <SafeAreaView className='flex-1 items-center bg-themeBg'>
      {followers?.map((owner: Owner) => (
        <View key={owner.id} className='flex-row items-center mt-5'>
          <Pressable
            className='h-[80px] flex flex-row flex-1 rounded-2xl bg-themeInput shadow-sm shadow-themeShadow'
            onPress={() => {
              navigation.push('Owner Profile', { ownerId: owner.id });
            }}>
            <View className='w-[80px] aspect-square flex justify-center items-center mr-5 p-1'>
              {owner?.ProfilePicture?.url ? (
                <Image
                  className='w-full h-full rounded-xl'
                  source={{
                    uri: owner.ProfilePicture.url,
                  }}
                />
              ) : (
                <Ionicon name='person' size={50} style={{ opacity: 0.8 }} />
              )}
            </View>
            <View className='flex justify-center'>
              <Text className='text-2xl -mb-1'>{owner.name}</Text>
              <Text className='text-sm'>@{owner.username}</Text>
            </View>
          </Pressable>
        </View>
      ))}
    </SafeAreaView>
  );
};

export default Followers;
