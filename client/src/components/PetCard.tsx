import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, View, Alert } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Pet } from '../__generated__/graphql';
import { Entypo, Ionicon } from '../utils/Icons';
import Image from './Image';
import PetTypeImage from './PetTypeImage';
import Text from './Text';
import { MenuAction, MenuView } from '@react-native-menu/menu';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { DELETE_PET } from '../graphql/Pet';
import { REMOVE_PET } from '../redux/constants';
import { Modalize } from 'react-native-modalize';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { options } from '../utils/hapticFeedbackOptions';
import { themeConfig } from '../utils/theme';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Portal } from 'react-native-portalize';

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
  const insets = useSafeAreaInsets();

  const contextModalRef = useRef<Modalize>(null);

  const openContextModal = useCallback(() => {
    trigger(HapticFeedbackTypes.rigid, options);
    contextModalRef.current?.open();
  }, [contextModalRef]);

  const closeContextModal = useCallback(() => {
    contextModalRef.current?.close();
  }, [contextModalRef]);

  useEffect(() => {
    if (isSelected) {
      height.value = withTiming(140);
    } else {
      height.value = withTiming(80);
    }
  }, [isSelected]);

  const deleteAlert = () =>
    Alert.alert('Delete Pet', 'Are you sure you want to delete your pet?', [
      {
        text: 'Delete',
        onPress: () => handleDeletePet(),
        style: 'destructive',
      },
      { text: 'Cancel' },
    ]);

  const handleDeletePet = useCallback(() => {
    if (!pet.id) return;

    deletePet({ variables: { deletePetId: pet.id } })
      .then(({ data }) => {
        if (data?.deletePet) {
          dispatch({ type: REMOVE_PET, payload: pet.id });
        }

        trigger(HapticFeedbackTypes.notificationSuccess, options);
        Toast.show({
          type: 'success',
          text1: 'Pet deleted.',
          position: 'top',
          topOffset: 10 + insets.top,
          text1Style: { fontFamily: 'BalooChettan2-Regular' },
        });
      })
      .catch((err) => {
        console.log(JSON.stringify(err, null, 2));
        trigger(HapticFeedbackTypes.notificationError, options);
        Toast.show({
          type: 'error',
          text1: 'An error occured when deleting pet.',
          position: 'top',
          topOffset: 10 + insets.top,
          text1Style: { fontFamily: 'BalooChettan2-Regular' },
        });
      });
  }, [pet.id, deletePet, dispatch, insets.top]);

  const contextModal = useMemo(() => {
    return (
      <Modalize
        ref={contextModalRef}
        handlePosition='inside'
        handleStyle={{ backgroundColor: themeConfig.customColors.themeText }}
        useNativeDriver
        modalStyle={{ backgroundColor: themeConfig.customColors.themeInput }}
        adjustToContentHeight
        withHandle={false}
        HeaderComponent={
          <View className='flex-row justify-center gap-x-5 pb-14 pt-5 px-5'>
            <Pressable
              className='flex items-center'
              onPress={() => {
                // TODO
              }}>
              <View className='rounded-full p-2 aspect-square bg-themeBtn'>
                <Ionicon name='share-social' size={20} color={themeConfig.customColors.themeText} />
              </View>
              <Text className='mt-1'>Share</Text>
            </Pressable>

            {!isOwner && (
              <Pressable
                className='flex items-center'
                onPress={() => {
                  closeContextModal();

                  setTimeout(() => {
                    trigger(HapticFeedbackTypes.notificationSuccess, options);
                    Toast.show({
                      type: 'info',
                      text1: 'Your report has been sent!',
                      position: 'top',
                      topOffset: 10 + insets.top,
                      text1Style: { fontFamily: 'BalooChettan2-Regular' },
                    });
                  }, 500);
                }}>
                <View className='rounded-full p-2 aspect-square bg-themeBtn'>
                  <Ionicon name='flag' size={20} color={themeConfig.customColors.themeText} />
                </View>
                <Text className='mt-1'>Report</Text>
              </Pressable>
            )}

            {isOwner && (
              <Pressable
                className='flex items-center'
                onPress={() => {
                  deleteAlert();
                  closeContextModal();
                }}>
                <View className='rounded-full p-2 aspect-square bg-themeBtn'>
                  <Ionicon name='trash-outline' size={20} color={themeConfig.customColors.themeText} />
                </View>
                <Text className='mt-1'>Delete</Text>
              </Pressable>
            )}
          </View>
        }></Modalize>
    );
  }, [contextModalRef, isOwner, closeContextModal, insets.top]);

  return (
    <Animated.View style={{ height }} className={'flex-1 rounded-2xl bg-white shadow-sm shadow-themeShadow ' + (isSelected ? 'mb-6' : 'mb-3')}>
      <Portal>{contextModal}</Portal>
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
            {isSelected ? <Entypo name='chevron-up' size={28} color={'#8f5f43'} /> : <Entypo name='chevron-down' size={28} color={'#8f5f43'} />}
          </Pressable>
        </View>
      </Pressable>
      {isSelected && isOwner && (
        <View className='absolute bottom-0 right-0 pr-5 pb-5'>
          {/* <MenuView
            onPressAction={({ nativeEvent }) => {
              if (nativeEvent.event === 'delete') {
                deleteAlert
              }
            }}
            actions={menuActions}>
            <View className=''>
              <Entypo name='dots-three-horizontal' size={24} color={'#8f5f43'} />
            </View>
          </MenuView> */}
          <Pressable onPress={openContextModal}>
            <View className=''>
              <Entypo name='dots-three-horizontal' size={24} color={'#8f5f43'} />
            </View>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};

export default PetCard;
