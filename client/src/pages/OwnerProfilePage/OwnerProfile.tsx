import { useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, RefreshControl, SafeAreaView, ScrollView, Share, View } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import { Owner, Pet } from '../../__generated__/graphql';
import Image from '../../components/Image';
import PetCard from '../../components/PetCard';
import Text from '../../components/Text';
import EditProfileModal from '../../components/modals/EditProfileModal';
import { GET_OWNER_BY_ID } from '../../graphql/Owner';
import { GET_PETS_BY_OWNER_ID } from '../../graphql/Pet';
import { OwnerDAO, ProfileReducer } from '../../redux/reducers/profileReducer';
import { Feather, Ionicon } from '../../utils/Icons';

interface Props {
  ownerId: string;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Owner Profile', undefined>;
}

const OwnerProfile = ({ ownerId, navigation }: Props) => {
  const { data: ownerData, refetch: refetchOwnerData } = useQuery(GET_OWNER_BY_ID, { variables: { id: ownerId }, pollInterval: 2000 });
  const { data: petData, refetch: refetchPetData } = useQuery(GET_PETS_BY_OWNER_ID, { variables: { id: ownerId }, pollInterval: 2000 });
  const owner: Owner | undefined = useMemo(() => ownerData?.getOwnerById.owner, [ownerData]);
  const pets: Pet[] = useMemo(() => {
    return petData?.getPetsByOwnerId.pets || [];
  }, [petData?.getPetsByOwnerId.pets]);

  const [modals, setModals] = useState({ editProfile: false });
  const [selectedPetId, setSelectedPetId] = useState<string>();
  const currentOwnerId = useSelector((state: ProfileReducer) => state.profile.owner?.id);
  const isOwner = useMemo(() => currentOwnerId === owner?.id, [owner?.id, currentOwnerId]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    setTimeout(() => {
      refetchOwnerData();
      refetchPetData();
      setRefreshing(false);
    }, 600);
  }, [ownerId, refetchOwnerData, refetchPetData]);

  const setEditProfileModalVisible = useCallback((bool: boolean) => {
    setModals((prev) => {
      return { ...prev, editProfile: bool };
    });
  }, []);

  const onShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: 'Pet Connect - FinalScript',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  return (
    <SafeAreaView className='bg-themeBg h-full w-full p-5 flex flex-col flew-grow'>
      {isOwner && (
        <Modal
          visible={modals.editProfile}
          presentationStyle='pageSheet'
          animationType='slide'
          onRequestClose={() => {
            setEditProfileModalVisible(false);
          }}>
          <EditProfileModal
            profile={owner as OwnerDAO}
            forPet={false}
            closeModal={() => {
              setEditProfileModalVisible(false);
            }}
          />
        </Modal>
      )}

      <ScrollView
        className='w-full px-5'
        scrollEventThrottle={16}
        refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className='mt-5 flex flex-row items-center justify-between'>
          <View className='relative'>
            <Pressable
              onPress={() => {
                if (owner?.ProfilePicture) {
                  navigation.push('Profile Picture', { profilePicture: owner?.ProfilePicture });
                }
              }}>
              <View className='w-28 h-28 rounded-full border-2 border-themeActive flex items-center justify-center'>
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
            </Pressable>
          </View>
          <View className='px-5 flex flex-row gap-7'>
            <View className='flex items-center'>
              <Text className='text-xl font-bold'>{pets.length}</Text>
              <Text className='text-md'>Pets</Text>
            </View>
            <Pressable
              onPress={() => {
                navigation.push('Following', { ownerId });
              }}>
              <View className='flex items-center'>
                <Text className='text-xl font-bold'>{owner?.followingCount}</Text>
                <Text className='text-md'>Following</Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View className='mt-3'>
          <Text className='text-xl font-bold'>{owner?.name}</Text>
          {owner?.location && <Text className='text-md'>📍 {owner?.location}</Text>}
        </View>
        <View className='mt-5 flex-row gap-x-3'>
          <PressableOpacity
            className='flex-1'
            activeOpacity={0.6}
            onPress={() => {
              isOwner && setEditProfileModalVisible(true);
            }}>
            <View className='bg-themeBtn px-7 py-2 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>{isOwner ? 'Edit Profile' : 'Add Friend'}</Text>
            </View>
          </PressableOpacity>
          <PressableOpacity
            className='flex-1'
            activeOpacity={0.6}
            onPress={() => {
              onShare();
            }}>
            <View className='bg-themeBtn px-7 py-2 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>Share Profile</Text>
            </View>
          </PressableOpacity>
        </View>
        <View className='flex-col justify-center'>
          <View className='mt-5 flex-col justify-center'>
            <View className='mb-5'>
              <Text className='text-2xl font-bold text-themePrimary'>{pets.length === 0 ? 'No Pets' : isOwner ? 'My Pets' : 'Pet List'}</Text>
            </View>
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                goToProfile={() => {
                  navigation.navigate('Pet Profile', { petId: pet.id });
                }}
                isSelected={selectedPetId === pet.id}
                setIsSelected={setSelectedPetId}
                isOwner={isOwner}
              />
            ))}
          </View>
          {isOwner && (
            <View className='flex-row items-center mt-4'>
              <Pressable
                className='flex-1 rounded-2xl bg-white shadow-sm shadow-themeShadow  flex-row items-center p-3'
                onPress={() => {
                  navigation.navigate('Pet Creation');
                }}>
                <View className='h-14 w-14 flex justify-center items-center mr-5 bg-themeActive rounded-full'>
                  <Feather name='plus' size={30} color='#8f5f43' />
                </View>
                <Text className='text-xl font-medium'>Add Pet</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnerProfile;
