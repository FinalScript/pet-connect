import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, Share, View } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import { Owner, Pet } from '../../__generated__/graphql';
import Image from '../../components/Image';
import PetCard from '../../components/PetCard';
import Text from '../../components/Text';
import EditProfileModal from '../../components/modals/EditProfileModal';
import { OwnerDAO, ProfileReducer } from '../../redux/reducers/profileReducer';
import { Ionicon } from '../../utils/Icons';

interface Props {
  owner: Owner;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Owner Profile', undefined>;
}

const OwnerProfile = ({ owner, navigation }: Props) => {
  const [modals, setModals] = useState({ editProfile: false });
  const [selectedPetId, setSelectedPetId] = useState<string>();
  const currentOwnerId = useSelector((state: ProfileReducer) => state.profile.owner?.id);
  const isOwner = useMemo(() => currentOwnerId === owner?.id, [owner?.id, currentOwnerId]);

  const pets = useMemo(() => {
    return owner?.Pets || [];
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
    return (
      <View className='flex-col justify-center'>
        {pets && <Text className='m-5 text-center'>{isOwner && "My "}Pets</Text>}
        {pets.map((pet) => {
          if (!pet) {
            return;
          }

          return (
            <PetCard
              key={pet?.id}
              pet={pet}
              goToProfile={() => {
                navigation.push('Pet Profile', { petId: pet.id });
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

      <ScrollView className='w-full px-5'>
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
                if (owner?.FollowedPets) {
                  const validPets = owner.FollowedPets.filter((pet): pet is Pet => pet !== null);
                  navigation.push('Following', { following: validPets });
                }
              }}>
              <View className='flex items-center'>
                <Text className='text-xl font-bold'>{owner?.FollowedPets?.length}</Text>
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
