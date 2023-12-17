import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Pet } from '../__generated__/graphql';
import { PetDAO } from '../redux/reducers/profileReducer';
import { Ionicon, MaterialCommunityIcons } from '../utils/Icons';
import { themeConfig } from '../utils/theme';
import Image from './Image';
import PetTypeImage from './PetTypeImage';
import Text from './Text';
import PetSettingsModal from './modals/PetSettingsModal';

interface Props {
  pet: Pet;
  isSelected: boolean;
  setIsSelected: Dispatch<SetStateAction<string | undefined>>;
  goToProfile: () => void;
  isOwner: boolean;
}
const PetCard = ({ pet, goToProfile, isSelected = false, setIsSelected, isOwner }: Props) => {
  const height = useSharedValue(80);
  const [modals, setModals] = useState({ petSettings: false });
  useEffect(() => {
    if (isSelected) {
      height.value = withTiming(140);
    } else {
      height.value = withTiming(80);
    }
  }, [isSelected]);

  const setPetSettingsModalVisible = useCallback((bool: boolean) => {
    setModals((prev) => {
      return { ...prev, petSettings: bool };
    });
  }, []);

  return (
    <Animated.View style={{ height }} className={'flex-1 rounded-2xl bg-themeInput shadow-sm shadow-themeShadow ' + (isSelected ? 'mb-6' : 'mb-3')}>
      <Pressable
        className={'flex flex-row flex-1'}
        onPress={() => {
          goToProfile();
        }}>
        <Animated.View style={{ width: height, minWidth: 80 }} className={'aspect-square flex justify-center items-center mr-5 p-1'}>
          {pet?.ProfilePicture?.url ? (
            <Image
              className='w-full h-full rounded-xl'
              source={{
                uri: pet.ProfilePicture.url,
              }}
            />
          ) : (
            pet.type && <PetTypeImage type={pet.type} className='w-10 h-10' />
          )}
        </Animated.View>
        <View className='flex justify-around h-full'>
          <View className='flex '>
            <View className='flex-row items-center'>
              <Text className='text-xl font-medium'>{pet.name}</Text>
              {pet.type && <PetTypeImage type={pet.type} className='w-5 h-5 ml-2' />}
            </View>
            <Text className='text-sm'>@{pet.username}</Text>
          </View>

          {isSelected && (
            <View className='flex-row '>
              <View className='flex items-center mr-3'>
                <Text className='text-base'>{pet.postsCount}</Text>
                <Text className='text-xs'>Posts</Text>
              </View>
              <View className='flex items-center mr-3'>
                <Text className='text-base'>{pet.followerCount}</Text>
                <Text className='text-xs'>Followers</Text>
              </View>
              <View className='flex items-center mr-3'>
                <Text className='text-base'>{pet.totalLikes}</Text>
                <Text className='text-xs'>Likes</Text>
              </View>
            </View>
          )}
        </View>

        <View className='flex-1 flex-row justify-end'>
          <Pressable
            className='pr-5 pt-5'
            onPress={() => {
              setIsSelected((prev) => {
                if (prev === pet.id) {
                  return undefined;
                } else {
                  return pet.id;
                }
              });
            }}>
            {isSelected ? (
              <Ionicon name='chevron-up' size={24} color={themeConfig.customColors.themeText} />
            ) : (
              <Ionicon name='chevron-down' size={24} color={themeConfig.customColors.themeText} />
            )}
          </Pressable>
        </View>
      </Pressable>
      {isSelected && isOwner && (
        <View className='absolute bottom-0 right-0'>
          <Pressable
            className='pr-5 pb-5'
            onPress={() => {
              setPetSettingsModalVisible(true);
            }}>
            <MaterialCommunityIcons name='dots-horizontal' size={24} color={themeConfig.customColors.themeText}></MaterialCommunityIcons>
          </Pressable>
          <View>
            <Modal
              visible={modals.petSettings}
              presentationStyle='pageSheet'
              animationType='slide'
              onRequestClose={() => {
                setPetSettingsModalVisible(false);
              }}>
              <PetSettingsModal
                closeModal={() => {
                  setPetSettingsModalVisible(false);
                }}
                pet={pet}
              />
            </Modal>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default PetCard;
