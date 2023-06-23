import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Image, ModalProps, TouchableHighlight, View } from 'react-native';
import { OwnerDAO, PetDAO, ProfileReducer } from '../redux/reducers/profileReducer';
import { useDispatch, useSelector } from 'react-redux';

import { Buffer } from 'buffer';
import { CURRENT_USER } from '../redux/constants';
import Feather from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import PetTypeImage from './PetTypeImage';
import { Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Text from './Text';
import { options } from '../utils/hapticFeedbackOptions';
import { useCallback } from 'react';

interface Props extends ModalProps {
  navigateNewPet: () => void;
  currentUser: OwnerDAO | PetDAO | undefined;
  closeModal: () => void;
}

const AccountSwitcherModal = ({ navigateNewPet, currentUser, closeModal }: Props) => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);

  const switchProfile = useCallback(
    (id?: string, isPet?: boolean) => {
      dispatch({ type: CURRENT_USER, payload: { id, isPet } });
      trigger(HapticFeedbackTypes.impactMedium, options);

      setTimeout(() => {
        closeModal();
      }, 100);
    },
    [dispatch]
  );

  return (
    <View className='flex w-full h-full bg-themeB px-5 py-5 pt-10'>
      <Text className='text-3xl font-bold text-center'>Switch Profile</Text>
      <ScrollView className='flex-grow'>
        <View className='flex flex-row items-center my-4 px-3'>
          <View className='flex-1 h-[1px] bg-themeText rounded-xl' />
          <View>
            <Text className='text-center px-5'>Owner</Text>
          </View>
          <View className='flex-1 h-[1px] bg-themeText rounded-xl' />
        </View>
        <Pressable
          className={
            (owner?.id === currentUser?.id ? 'border-themeActive' : 'border-transparent') +
            ' flex flex-row items-center rounded-3xl bg-themeInput border-4 shadow-sm shadow-themeShadow py-1 px-1'
          }
          onPress={() => {
            switchProfile(owner?.id, false);
          }}>
          <View className='h-16 w-16 flex justify-center items-center mr-5'>
            {owner?.ProfilePicture ? (
              <Image
                className='w-full h-full rounded-2xl'
                source={{
                  uri: `data:image/*;base64,${Buffer.from(owner?.ProfilePicture.data).toString('base64')}`,
                }}
              />
            ) : (
              <Ionicon name='person' size={50} />
            )}
          </View>
          <Text className='text-xl'>{owner?.username}</Text>
          {owner?.id === currentUser?.id && (
            <View className='absolute right-10'>
              <Ionicon name='checkmark-circle' size={25} color={'#FFBA93'} />
            </View>
          )}
        </Pressable>

        {pets.length !== 0 && (
          <View className='flex flex-row items-center my-4 px-3'>
            <View className='flex-1 h-[1px] bg-themeText rounded-xl' />
            <View>
              <Text className='text-center px-5'>Pets</Text>
            </View>
            <View className='flex-1 h-[1px] bg-themeText rounded-xl' />
          </View>
        )}
        {pets.map((pet) => {
          return (
            <Pressable
              key={pet.id}
              className={
                (pet?.id === currentUser?.id ? 'border-themeActive' : 'border-transparent') +
                ' flex flex-row items-center mb-5 rounded-3xl bg-themeInput border-4 shadow-sm shadow-themeShadow py-1 px-1'
              }
              onPress={() => {
                switchProfile(pet?.id, false);
              }}>
              <View className='h-16 w-16 flex justify-center items-center mr-5'>
                {pet.ProfilePicture ? (
                  <Image
                    className='w-full h-full rounded-2xl'
                    source={{
                      uri: `data:image/*;base64,${Buffer.from(pet.ProfilePicture.data).toString('base64')}`,
                    }}
                  />
                ) : (
                  <PetTypeImage type={pet.type} className='w-full h-full' />
                )}
              </View>
              <Text className='text-xl'>{pet.username}</Text>
              {pet.id === currentUser?.id && (
                <View className='absolute right-10'>
                  <Ionicon name='checkmark-circle' size={25} color={'#FFBA93'} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <View className='flex flex-row justify-center py-5'>
        <TouchableHighlight
          className='bg-themeBtn rounded-3xl shadow-sm shadow-themeShadow'
          underlayColor={'#c59071'}
          onPress={() => {
            closeModal();
            navigateNewPet();
          }}>
          <View className='px-5 py-2 flex flex-row justify-center items-center'>
            <Feather name='plus' size={20} />
            <Text className='text-lg font-semibold text-themeText ml-2'>Create Pet Profile</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default AccountSwitcherModal;
