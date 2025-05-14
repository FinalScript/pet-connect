import { useQuery } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../../App';
import Image from '../components/Image';
import PetTypeImage from '../components/PetTypeImage';
import { GET_FOLLOWING_BY_OWNER_ID } from '../graphql/Owner';
import Text from '../components/Text';

type Props = NativeStackScreenProps<RootStackParamList, 'Following'>;

const Following = ({
  route: {
    params: { ownerId },
  },
  navigation,
}: Props) => {
  const { data: followingData, refetch: refetchFollowingData } = useQuery(GET_FOLLOWING_BY_OWNER_ID, { variables: { ownerId }, pollInterval: 10000 });
  const following = useMemo(() => followingData?.getOwnerById.owner.Following || [], [followingData]);

  return (
    <SafeAreaView className='flex-1 items-center bg-themeBg'>
      <ScrollView className='w-full px-5 pt-2.5 mt-2.5'>
        {following.map((pet) => {
          return (
            <Pressable
              key={pet.id}
              className='h-[80px] flex flex-row flex-1 mt-5 rounded-2xl bg-themeInput shadow-sm shadow-themeShadow'
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
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Following;
