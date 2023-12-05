import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { RootStackParamList } from '../../App';
import Image from '../components/Image';
import { useLazyQuery } from '@apollo/client';
import { GET_OWNER_BY_ID } from '../graphql/Owner';
import { Ionicon } from '../utils/Icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile Picture'>;

const ProfilePicture = ({
  navigation,
  route: {
    params: { id, pet },
  },
}: Props) => {
  const [getOwner, { data: ownerData }] = useLazyQuery(GET_OWNER_BY_ID, { fetchPolicy: 'no-cache' });
  const owner = useMemo(() => ownerData?.getOwnerById.owner, [ownerData]);

  useEffect(() => {
    getOwner({ variables: { id: id } });
  }, [id, getOwner]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View className='w-64 h-64 rounded-full border-2 border-themeActive flex items-center justify-center'>
        {owner?.ProfilePicture?.url ? (
          <Image
            className='w-full h-full rounded-full'
            source={{
              uri: owner.ProfilePicture.url,
            }}
          />
        ) : (
          <Ionicon name='person' size={55} />
        )}
      </View>
    </View>
  );
};

export default ProfilePicture;
