import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Pet } from '../__generated__/graphql';
import { PetDAO } from '../redux/reducers/profileReducer';
import { Entypo, Ionicon, MaterialCommunityIcons } from '../utils/Icons';
import { themeConfig } from '../utils/theme';
import Image from './Image';
import PetTypeImage from './PetTypeImage';
import Text from './Text';
import { MenuAction, MenuView } from '@react-native-menu/menu';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { DELETE_PET } from '../graphql/Pet';
import { REMOVE_PET } from '../redux/constants';

interface Props {
  pet: Pet;
  isSelected: boolean;
  setIsSelected: Dispatch<SetStateAction<string | undefined>>;
  goToProfile: () => void;
  isOwner: boolean;
}
const PetCard = ({ pet, goToProfile, isSelected = false, setIsSelected, isOwner }: Props) => {
  const height = useSharedValue(80);
  const dispatch = useDispatch();
  const [deletePet] = useMutation(DELETE_PET);

  useEffect(() => {
    if (isSelected) {
      height.value = withTiming(140);
    } else {
      height.value = withTiming(80);
    }
  }, [isSelected]);

  const menuActions: MenuAction[] = useMemo(() => {
    const actions: MenuAction[] = [];

    actions.push({
      id: 'delete',
      title: 'Delete',
      attributes: {
        destructive: true,
      },
      image: Platform.select({
        ios: 'trash',
        android: 'ic_menu_delete',
      }),
    });

    return actions;
  }, []);

  const handleDeletePet = useCallback(() => {
    if (!pet.id) return;

    deletePet({ variables: { deletePetId: pet.id } })
      .then(({ data }) => {
        if (data?.deletePet) {
          dispatch({ type: REMOVE_PET, payload: pet.id });
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err, null, 2));
      });
  }, []);

  return (
    <Animated.View style={{ height }} className={'flex-1 rounded-2xl bg-white shadow-sm shadow-themeShadow ' + (isSelected ? 'mb-6' : 'mb-3')}>
      <Pressable
        className={'flex flex-row flex-1'}
        onPress={() => {
          goToProfile();
        }}>
        <Animated.View style={{ width: height, minWidth: 80 }} className={'aspect-square flex justify-center items-center mr-2 p-3'}>
          {pet?.ProfilePicture?.url ? (
            <Image
              className={'w-full h-full rounded-full'}
              source={{
                uri: pet.ProfilePicture.url,
              }}
            />
          ) : (
            pet.type && <PetTypeImage type={pet.type} className='w-10 h-10' />
          )}
        </Animated.View>
        <Animated.View className='flex justify-around h-full'>
          <View className='flex '>
            <View className='flex-row items-center'>
              <Text className='text-xl font-medium'>{pet.name}</Text>
              {pet.type && <PetTypeImage type={pet.type} className='w-5 h-5 ml-2' />}
            </View>
            <Text className='text-sm text-gray-500'>@{pet.username}</Text>
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
        </Animated.View>

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
              <Entypo name='chevron-up' size={28} color={'#8f5f43'} />
            ) : (
              <Entypo name='chevron-down' size={28} color={'#8f5f43'} />
            )}
          </Pressable>
        </View>
      </Pressable>
      {isSelected && isOwner && (
        <View className='absolute bottom-0 right-0 pr-5 pb-5'>
          <MenuView
            onPressAction={({ nativeEvent }) => {
              if (nativeEvent.event === 'delete') {
                handleDeletePet();
              }
            }}
            actions={menuActions}>
            <View className=''>
              <Entypo name='dots-three-horizontal' size={24} color={'#8f5f43'} />
            </View>
          </MenuView>
        </View>
      )}
    </Animated.View>
  );
};

export default PetCard;
