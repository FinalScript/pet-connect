import { Image, Modal, ModalProps, View } from 'react-native';
import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENT_USER } from '../redux/constants';
import { OwnerDAO, PetDAO, ProfileReducer } from '../redux/reducers/profileReducer';
import { Buffer } from 'buffer';
import Ionicon from 'react-native-vector-icons/Ionicons';
import PetTypeImage from './PetTypeImage';
import Text from './Text';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { options } from '../utils/hapticFeedbackOptions';

interface Props extends ModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: OwnerDAO | PetDAO | undefined;
}

const AccountSwitcherModal = ({ modalVisible, setModalVisible, currentUser }: Props) => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);

  const switchProfile = useCallback(
    (id?: string, isPet?: boolean) => {
      dispatch({ type: CURRENT_USER, payload: { id, isPet } });
      trigger(HapticFeedbackTypes.impactMedium, options);

      setTimeout(() => {
        setModalVisible(false);
      }, 100);
    },
    [dispatch]
  );

  return (
    <Modal
      animationType='slide'
      presentationStyle='formSheet'
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View className='w-full h-full bg-themeBg bg-themeB px-5 py-5'>
        <Text className='text-3xl font-bold'>Switch User</Text>
        <View className='mt-5 flex'>
          <Pressable
            className={
              (owner?.id === currentUser?.id ? 'border-themeActive' : 'border-transparent') +
              ' flex flex-row items-center mb-5 rounded-3xl bg-themeInput border-4 shadow-sm shadow-themeShadow py-2.5 px-5'
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
          {pets.map((pet) => {
            return (
              <Pressable
                key={pet.id}
                className={
                  (pet?.id === currentUser?.id ? 'border-themeActive' : 'border-transparent') +
                  ' flex flex-row items-center mb-5 rounded-3xl bg-themeInput border-4 shadow-sm shadow-themeShadow py-2.5 px-5'
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
        </View>
      </View>
    </Modal>
  );
};

export default AccountSwitcherModal;
