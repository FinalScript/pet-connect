import { Image, ModalProps, TouchableHighlight, View } from 'react-native';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { useDispatch, useSelector } from 'react-redux';
import { OwnerDAO, PetDAO, ProfileReducer } from '../../redux/reducers/profileReducer';

import { useCallback } from 'react';
import { Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getApiBaseUrl } from '../../api';
import { CURRENT_USER } from '../../redux/constants';
import { Feather, Ionicon } from '../../utils/Icons';
import { options } from '../../utils/hapticFeedbackOptions';
import PetTypeImage from '../PetTypeImage';
import Text from '../Text';

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
    <View className='flex w-full h-[70%] bottom-0 absolute shadow-lg px-5 pb-5 rounded-t-xl bg-themeBg'>
      <View className='flex-row justify-center'>
        <View className='bg-themeText w-16 h-1 rounded-xl mt-2'></View>
      </View>
      <ScrollView className='flex-grow relative mt-5'>
        <View className='absolute h-full py-10'>
          <View className='bg-themeText h-full w-[2px] ml-5'></View>
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
            {owner?.ProfilePicture?.path ? (
              <Image
                className='w-full h-full rounded-2xl'
                source={{
                  uri: `${getApiBaseUrl()}/${owner.ProfilePicture.path}?${Date.now()}`,
                }}
              />
            ) : (
              <Ionicon name='person' size={50} style={{ opacity: 0.8 }} />
            )}
          </View>
          <Text className='text-xl'>{owner?.username}</Text>
          {owner?.id === currentUser?.id && (
            <View className='absolute right-10'>
              <Ionicon name='checkmark-circle' size={25} color={'#FFBA93'} />
            </View>
          )}
        </Pressable>

        {pets.map((pet) => {
          return (
            <View key={pet.id} className='flex-row items-center mt-5 ml-5'>
              <View className='h-[2px] w-5 bg-themeText'></View>
              <Pressable
                className={
                  (pet?.id === currentUser?.id ? 'border-themeActive' : 'border-transparent') +
                  ' flex flex-row flex-1 items-center rounded-3xl bg-themeInput border-4 shadow-sm shadow-themeShadow py-1 px-1'
                }
                onPress={() => {
                  switchProfile(pet?.id, true);
                }}>
                <View className='h-16 w-16 flex justify-center items-center mr-5'>
                  {pet?.ProfilePicture?.path ? (
                    <Image
                      className='w-full h-full rounded-2xl'
                      source={{
                        uri: `${getApiBaseUrl()}/${pet.ProfilePicture.path}?${Date.now()}`,
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
            </View>
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
