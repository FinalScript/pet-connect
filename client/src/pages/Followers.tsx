import { useQuery } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { Owner } from '../__generated__/graphql';
import Image from '../components/Image';
import { GET_FOLLOWERS_BY_PET_ID } from '../graphql/Pet';
import { Ionicon } from '../utils/Icons';
import Text from '../components/Text';

type Props = NativeStackScreenProps<RootStackParamList, 'Followers'>;

const Followers = ({
  route: {
    params: { petId },
  },
  navigation,
}: Props) => {
  const { data: followersData, refetch: refetchFollowersData } = useQuery(GET_FOLLOWERS_BY_PET_ID, { variables: { petId }, pollInterval: 10000 });
  const followers = useMemo(() => followersData?.getPetById.pet.Followers || [], [followersData]);

  return (
    <SafeAreaView className='flex-1 items-center bg-themeBg'>
      <ScrollView className='w-full px-5 pt-2.5 mt-2.5'>
        {followers.map((owner: Owner) => {
          return (
            <Pressable
              key={owner.id}
              className='h-[80px] flex flex-row flex-1 mt-5 rounded-2xl bg-themeInput shadow-sm shadow-themeShadow'
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
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Followers;
