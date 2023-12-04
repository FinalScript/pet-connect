import { Dimensions, ModalProps, View } from 'react-native';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { useDispatch, useSelector } from 'react-redux';
import { OwnerDAO, PetDAO, ProfileReducer } from '../../redux/reducers/profileReducer';
import { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { CURRENT_USER } from '../../redux/constants';
import { Feather, Ionicon } from '../../utils/Icons';
import { options } from '../../utils/hapticFeedbackOptions';
import PetTypeImage from '../PetTypeImage';
import Text from '../Text';
import Image from '../Image';

interface Props extends ModalProps {
  navigateNewPet: () => void;
  currentUser: OwnerDAO | PetDAO | undefined;
  closeModal: () => void;
}

const AccountSwitcherModal = ({ navigateNewPet, currentUser, closeModal }: Props) => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);

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
    <View style={{ height: Dimensions.get('screen').height * 0.55 }} className={'flex w-full shadow-lg px-5 pb-7 pt-5 rounded-t-xl bg-themeBg'}>
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
            {owner?.ProfilePicture?.url ? (
              <Image
                className='w-full h-full rounded-2xl'
                source={{
                  uri: owner.ProfilePicture.url,
                }}
              />
            ) : (
              <Ionicon name='person' size={50} style={{ opacity: 0.8 }} />
            )}
          </View>
          <View className='flex'>
            <Text className='text-2xl -mb-1'>{owner?.name}</Text>
            <Text className='text-sm'>@{owner?.username}</Text>
          </View>
          {owner?.id === currentUser?.id && (
            <View className='absolute right-5'>
              <Ionicon name='checkmark-circle' size={30} color={'#FFBA93'} />
            </View>
          )}
        </Pressable>

        <View className='flex-row items-center mt-5 ml-5'>
          <View className='h-[2px] w-5 bg-themeText'></View>
          <Pressable
            className={'flex flex-row flex-1 items-center rounded-3xl bg-themeInput border-4 border-transparent shadow-sm shadow-themeShadow py-1 px-1'}
            onPress={() => {
              closeModal();
              navigateNewPet();
            }}>
            <View className='h-16 w-16 flex justify-center items-center mr-5 border-dashed border-2 rounded-2xl'>
              <Feather name='plus' size={30} />
            </View>
            <Text className='text-xl'>Create Pet Profile</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountSwitcherModal;
