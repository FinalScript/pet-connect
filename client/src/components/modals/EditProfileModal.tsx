import React, { useCallback } from 'react';
import { Image, ModalProps, Pressable, View } from 'react-native';
import Config from 'react-native-config';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { OwnerDAO, PetDAO } from '../../redux/reducers/profileReducer';
import { Ionicon } from '../../utils/Icons';
import Text from '../Text';

interface Props extends ModalProps {
  closeModal: () => void;
  profile?: OwnerDAO | PetDAO;
}

const EditProfileModal = ({ closeModal, profile }: Props) => {
  const onSubmit = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <View className='flex w-full h-full px-2 py-5 bg-themeBg'>
      <View className='flex-row justify-between -mx-2 -mt-5'>
        <Pressable
          onPress={() => {
            closeModal();
          }}>
          <Text className='text-xl py-5 px-5'>Cancel</Text>
        </Pressable>
        <Text className='text-xl font-bold pt-5'>Edit Profile</Text>
        <Pressable onPress={onSubmit}>
          <Text className='text-xl py-5 px-5 text-blue-500'>Done</Text>
        </Pressable>
      </View>

      <View className='mt-3 px-2'>
        <View className='mb-5 flex flex-col justify-center items-center'>
          <PressableOpacity
            activeOpacity={0.8}
            className='w-[160px] h-[160px] bg-themeInput flex items-center justify-center rounded-3xl shadow-sm shadow-themeShadow'>
            {profile?.ProfilePicture?.path ? (
              <Image
                className='w-full h-full rounded-3xl'
                source={{
                  uri: Config.API_URL + '/' + profile.ProfilePicture.path,
                }}
              />
            ) : (
              <Ionicon name='person' size={55} />
            )}
          </PressableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditProfileModal;
