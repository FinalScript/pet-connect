import { useLazyQuery } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { GET_OWNER_BY_ID } from '../../graphql/Owner';
import OwnerProfile from './OwnerProfile';
import { GET_PETS_BY_OWNER_ID } from '../../graphql/Pet';

type Props = NativeStackScreenProps<RootStackParamList, 'Owner Profile'>;

const OwnerProfilePage = ({
  navigation,
  route: {
    params: { ownerId },
  },
}: Props) => {
  const [getOwner, { data: ownerData }] = useLazyQuery(GET_OWNER_BY_ID);
  const owner = useMemo(() => ownerData?.getOwnerById.owner, [ownerData]);

  useEffect(() => {
    getOwner({ variables: { id: ownerId } });
  }, [ownerId, getOwner]);

  useEffect(() => {
    navigation.setOptions({ title: owner?.username });
  }, [owner?.username]);

  return (
    <View>
      <OwnerProfile ownerId={owner.id} navigation={navigation} />
    </View>
  );
};

export default OwnerProfilePage;
