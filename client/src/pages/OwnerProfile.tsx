import { useLazyQuery } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, Share, View } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { RootStackParamList } from '../../App';
import Image from '../components/Image';
import PetTypeImage from '../components/PetTypeImage';
import Text from '../components/Text';
import { GET_POSTS_BY_PET_ID } from '../graphql/Post';
import EditProfileModal from '../components/modals/EditProfileModal';
import { OwnerDAO, PetDAO, ProfileReducer } from '../redux/reducers/profileReducer';
import { useSelector } from 'react-redux';
import { Ionicon } from '../utils/Icons';
import { GET_OWNER, GET_OWNER_BY_ID } from '../graphql/Owner';
import PetCard from '../components/PetCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Owner Profile'>;

const OwnerProfile = ({
  navigation,
  route: {
    params: { ownerId },
  },
}: Props) => {
  const currentOwnerId = useSelector((state: ProfileReducer) => state.profile.owner?.id);
  const [getOwner, { data: ownerData }] = useLazyQuery(GET_OWNER_BY_ID);
  const owner = useMemo(() => ownerData?.getOwnerById.owner, [ownerData]);
  const isOwner = useMemo(() => currentOwnerId === ownerId, [ownerId, currentOwnerId]);
  const [modals, setModals] = useState({ editProfile: false });
  const [selectedPetId, setSelectedPetId] = useState<string>();

  const pets = useMemo(() => {
    return owner?.Pets || [];
  }, [owner]);

  useEffect(() => {
    getOwner({ variables: { id: ownerId } });
  }, [ownerId, getOwner]);

  useEffect(() => {
    navigation.setOptions({ title: owner?.username });
  }, [owner]);

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

  const renderOwnerPets = useMemo(() => {
    console.log(pets);
    return (
      <View className='mt-10 flex-col justify-center'>
        {pets.map((pet) => {
          if (!pet) {
            return;
          }

          return (
            <PetCard
              key={pet?.id}
              pet={pet}
              goToProfile={() => {
                navigation.navigate('Pet Profile', { petId: pet.id });
              }}
              isSelected={selectedPetId === pet.id}
              setIsSelected={setSelectedPetId}
            />
          );
        })}
      </View>
    );
  }, [pets, selectedPetId, setSelectedPetId]);

  return (
    <SafeAreaView className='bg-themeBg h-full p-5 flex flex-col flew-grow'>
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

      <ScrollView className='w-full px-5'>
        <View className='mt-5 flex flex-row items-center justify-between'>
          <View className='relative'>
            <Pressable onPress={() => {}}>
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
            <View className='flex items-center'>
              <Text className='text-xl font-bold'>20</Text>
              <Text className='text-md'>Followers</Text>
            </View>
            <View className='flex items-center'>
              <Text className='text-xl font-bold'>25</Text>
              <Text className='text-md'>Following</Text>
            </View>
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
              <Text className='text-themeText text-base font-semibold text-center'>{isOwner ? 'Edit Profile' : 'Follow'}</Text>
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
        <View>{renderOwnerPets}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnerProfile;
