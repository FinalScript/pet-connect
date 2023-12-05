import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { RootStackParamList } from '../../App';
import Image from '../components/Image';
import { useLazyQuery } from '@apollo/client';
import { GET_OWNER_BY_ID } from '../graphql/Owner';
import { Ionicon } from '../utils/Icons';
import { GET_PET_BY_ID } from '../graphql/Pet';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile Picture'>;

const ProfilePicture = ({
  route: {
    params: { id, isPet },
  },
}: Props) => {
  const [getOwner, { data: ownerData }] = useLazyQuery(GET_OWNER_BY_ID, { fetchPolicy: 'no-cache' });
  const [getPet, { data: petData }] = useLazyQuery(GET_PET_BY_ID, { fetchPolicy: 'network-only' });

  const owner = useMemo(() => ownerData?.getOwnerById.owner, [ownerData]);
  const pet = useMemo(() => petData?.getPetById.pet, [petData]);

  useEffect(() => {
    if (isPet) {
      getPet({ variables: { id: id } });
    } else {
      getOwner({ variables: { id: id } });
    }
  }, [id, isPet, getOwner, getPet]);

  const profilePictureUrl = isPet ? pet?.ProfilePicture?.url : owner?.ProfilePicture?.url;

  return (
    <View className="flex-1 justify-center items-center bg-themeBg">
      <View className='w-64 h-64 rounded-full border-2 border-themeActive flex items-center justify-center '>
        {profilePictureUrl ? (
          <Image
            className='w-full h-full rounded-full'
            source={{ uri: profilePictureUrl }}
          />
        ) : (
          <Ionicon name='person' size={55} />
        )}
      </View>
    </View>
  );
};

export default ProfilePicture;

