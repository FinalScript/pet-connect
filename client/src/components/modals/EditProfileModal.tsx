import { View, SafeAreaView, Pressable, ModalProps, Image, TextInput } from 'react-native';
import React, { useCallback } from 'react';
import Text from '../Text';
import { OwnerDAO, PetDAO } from '../../redux/reducers/profileReducer';
import { PressableOpacity } from 'react-native-pressable-opacity';
import Config from 'react-native-config';
import { Ionicon } from '../../utils/Icons';
import UsernameInput from '../UsernameInput';

interface Props extends ModalProps {
  closeModal: () => void;
  profile?: OwnerDAO | PetDAO;
}

const EditProfileModal = ({ closeModal, profile }: Props) => {
  const onSubmit = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <SafeAreaView className='flex w-full h-full px-5 py-5'>
      <View className='flex-row justify-between px-5'>
        <Pressable
          onPress={() => {
            closeModal();
          }}>
          <Text className='text-xl'>Cancel</Text>
        </Pressable>
        <Text className='text-xl font-bold'>Edit Profile</Text>
        <Pressable onPress={onSubmit}>
          <Text className='text-xl text-blue-500'>Done</Text>
        </Pressable>
      </View>

      <View className='mt-8 px-2'>
        <View className='mb-5 flex flex-col justify-center items-center'>
          <PressableOpacity activeOpacity={0.8} className='w-[160px] h-[160px] bg-themeInput rounded-3xl shadow-sm shadow-themeShadow'>
            {profile?.ProfilePicture.path ? (
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
    </SafeAreaView>
  );
};

export default EditProfileModal;
