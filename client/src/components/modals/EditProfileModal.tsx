import { useMutation } from '@apollo/client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, ModalProps, Pressable, TextInput, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { useDispatch } from 'react-redux';
import * as env from '../../../env.json';
import { UploadToFirebaseResult, storageFolders, updateFileInFirebase, uploadToFirebase } from '../../firebase/firebaseStorage';
import { UPDATE_OWNER } from '../../graphql/Owner';
import { UPDATE_PET } from '../../graphql/Pet';
import { OWNER_DATA, UPDATE_PET as UPDATE_PET_REDUX } from '../../redux/constants';
import { OwnerDAO, PetDAO } from '../../redux/reducers/profileReducer';
import { Ionicon } from '../../utils/Icons';
import Text from '../Text';
import UsernameInput from '../UsernameInput';
import { ProfilePicture } from '../../__generated__/graphql';

interface Props extends ModalProps {
  closeModal: () => void;
  profile: OwnerDAO | PetDAO;
  forPet: boolean;
}

const EditProfileModal = ({ closeModal, profile, forPet = false }: Props) => {
  const initialProfilePicture: ProfilePicture = profile.ProfilePicture;
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [updateOwner] = useMutation(UPDATE_OWNER);
  const [updatePet] = useMutation(UPDATE_PET);
  const [ownerFormData, setOwnerFormData] = useState({
    username: profile?.username,
    name: profile?.name,
    location: profile?.location,
    profilePicture: profile?.ProfilePicture,
  });
  const [petFormData, setPetFormData] = useState({
    username: profile?.username,
    name: profile?.name,
    location: profile?.location,
    profilePicture: profile?.ProfilePicture,
    description: (profile as PetDAO)?.description,
    type: (profile as PetDAO)?.type,
  });

  const pickProfilePicture = useCallback(async () => {
    launchImageLibrary({
      mediaType: 'photo',
    })
      .then((image) => {
        console.log(image);
        if (!forPet) {
          setOwnerFormData((prev) => {
            return { ...prev, profilePicture: image.assets?.[0] };
          });
        } else {
          setPetFormData((prev) => {
            return { ...prev, profilePicture: image.assets?.[0] };
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [forPet, setPetFormData, setOwnerFormData]);

  const hasChanged = useMemo(() => {
    if (forPet) {
      return (
        petFormData.name !== profile?.name ||
        petFormData.username !== profile?.username ||
        petFormData.profilePicture !== profile?.ProfilePicture ||
        petFormData.description !== (profile as PetDAO)?.description
      );
    } else {
      return (
        ownerFormData.name !== profile?.name ||
        ownerFormData.username !== profile?.username ||
        ownerFormData.profilePicture !== profile?.ProfilePicture ||
        ownerFormData.location !== profile?.location
      );
    }
  }, [ownerFormData, petFormData, profile, forPet]);

  const onSubmit = useCallback(async () => {
    setError('');

    if (hasChanged) {
      setLoading(true);
      const formData = forPet ? petFormData : ownerFormData;

      let profilePictureData: UploadToFirebaseResult;

      if (formData.profilePicture) {
        const uploadRes =
          formData.profilePicture.path && formData.profilePicture.path !== initialProfilePicture.path
            ? await updateFileInFirebase(formData.profilePicture, initialProfilePicture.path)
            : await uploadToFirebase(formData.profilePicture, storageFolders.PROFILE_PICTURES);

        if (uploadRes) {
          profilePictureData = uploadRes;
        }
      }

      setTimeout(async () => {
        if (!forPet) {
          updateOwner({ variables: { ...formData, profilePicture: profilePictureData } })
            .then(({ data }) => {
              if (data?.updateOwner) {
                console.log(data);
                dispatch({ type: OWNER_DATA, payload: { ...profile, ...data.updateOwner } });

                setTimeout(() => {
                  closeModal();
                }, 500);
              }
            })
            .catch((err) => {
              console.log(JSON.stringify(err, null, 2));
              setError(err.message.toString());
              setLoading(false);
            });
        } else {
          updatePet({ variables: { ...formData, profilePicture: profilePictureData, updatePetId: profile.id } })
            .then(({ data }) => {
              if (data?.updatePet) {
                console.log(data.updatePet);
                dispatch({ type: UPDATE_PET_REDUX, payload: { ...profile, ...data.updatePet } });

                setTimeout(() => {
                  closeModal();
                }, 500);
              }
            })
            .catch((err) => {
              console.log(JSON.stringify(err, null, 2));
              setError(err.message.toString());
              setLoading(false);
            });
        }
      }, 500);
    } else {
      closeModal();
    }
  }, [ownerFormData, petFormData, profile, hasChanged, updateOwner, updatePet, dispatch, closeModal, forPet]);

  const getOwnerEditView = () => {
    return (
      <Pressable onPress={Keyboard.dismiss}>
        <View className='mt-3 px-2'>
          <View className='mb-5 flex flex-col justify-center items-center'>
            <PressableOpacity
              disabled={loading}
              onPress={() => {
                pickProfilePicture();
              }}
              disabledOpacity={1}
              activeOpacity={0.8}
              className='w-[160px] h-[160px] bg-themeInput flex items-center justify-center rounded-3xl shadow-sm shadow-themeShadow'>
              {ownerFormData?.profilePicture ? (
                <Image
                  className='w-full h-full rounded-3xl'
                  source={{
                    uri: ownerFormData.profilePicture.width ? ownerFormData.profilePicture.uri : ownerFormData.profilePicture.url,
                  }}
                />
              ) : (
                <Ionicon name='person' size={55} />
              )}
            </PressableOpacity>
          </View>

          <View>
            <View>
              <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Username</Text>
              <UsernameInput
                editable={!loading}
                maxLength={30}
                returnKeyType='next'
                placeholder='New Username'
                placeholderTextColor={'#444444bb'}
                value={ownerFormData.username}
                setValue={(e: any) => {
                  setOwnerFormData((prev) => {
                    return { ...prev, username: e };
                  });
                }}
                isValid={isUsernameValid}
                setIsValid={setIsUsernameValid}
                forOwner
              />
            </View>

            <View className=''>
              <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Name</Text>
              <TextInput
                editable={!loading}
                className={'border-transparent bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-lg'}
                style={{ fontFamily: 'BalooChettan2-Regular' }}
                placeholderTextColor={'#444444bb'}
                value={ownerFormData.name}
                onChangeText={(e) => {
                  setOwnerFormData((prev) => {
                    return { ...prev, name: e };
                  });
                }}
                maxLength={30}
                returnKeyType='next'
                placeholder='New Name'
              />
            </View>

            <View className='mt-3'>
              <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Location</Text>
              <TextInput
                editable={!loading}
                className={'border-transparent bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-lg'}
                style={{ fontFamily: 'BalooChettan2-Regular' }}
                placeholderTextColor={'#444444bb'}
                value={ownerFormData.location}
                onChangeText={(e) => {
                  setOwnerFormData((prev) => {
                    return { ...prev, location: e };
                  });
                }}
                maxLength={30}
                returnKeyType='next'
                placeholder='New Location'
              />
            </View>
          </View>
          <View className='mt-20'>
            <Text className='text-center text-red-600 font-bold text-lg'>{error}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const getPetEditView = () => {
    return (
      <Pressable onPress={Keyboard.dismiss}>
        <View className='mt-3 px-2'>
          <View className='mb-5 flex flex-col justify-center items-center'>
            <PressableOpacity
              disabled={loading}
              onPress={pickProfilePicture}
              disabledOpacity={1}
              activeOpacity={0.8}
              className='w-[160px] h-[160px] bg-themeInput flex items-center justify-center rounded-3xl shadow-sm shadow-themeShadow'>
              {petFormData?.profilePicture ? (
                <Image
                  className='w-full h-full rounded-3xl'
                  source={{
                    uri: petFormData.profilePicture.width ? petFormData.profilePicture.uri : petFormData.profilePicture.url,
                  }}
                />
              ) : (
                <Ionicon name='person' size={55} />
              )}
            </PressableOpacity>
          </View>

          <View>
            <View>
              <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Username</Text>
              <UsernameInput
                editable={!loading}
                maxLength={30}
                returnKeyType='next'
                placeholder='New Username'
                placeholderTextColor={'#444444bb'}
                value={petFormData.username}
                setValue={(e: any) => {
                  setPetFormData((prev) => {
                    return { ...prev, username: e };
                  });
                }}
                isValid={isUsernameValid}
                setIsValid={setIsUsernameValid}
              />
            </View>

            <View className='mt-3'>
              <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Name</Text>
              <TextInput
                editable={!loading}
                className={'border-transparent bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-lg'}
                style={{ fontFamily: 'BalooChettan2-Regular' }}
                placeholderTextColor={'#444444bb'}
                value={petFormData.name}
                onChangeText={(e) => setPetFormData((prev) => ({ ...prev, name: e }))}
                maxLength={30}
                returnKeyType='next'
                placeholder='New Name'
              />
            </View>

            <View className='mt-3'>
              <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Description</Text>
              <TextInput
                editable={!loading}
                className={'border-transparent bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-lg'}
                placeholderTextColor={'#444444bb'}
                style={{ fontFamily: 'BalooChettan2-Regular' }}
                value={petFormData.description}
                onChangeText={(e) => setPetFormData((prev) => ({ ...prev, description: e }))}
                maxLength={100}
                multiline
                placeholder='About the pet'
                scrollEnabled={false}
              />
            </View>
          </View>
          <View className='mt-20'>
            <Text className='text-center text-red-600 font-bold text-lg'>{error}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className='flex w-full h-full px-2 py-5 bg-themeBg'>
      <View className='flex-row justify-between -mx-2 -mt-5'>
        <Pressable
          disabled={loading}
          onPress={() => {
            closeModal();
          }}>
          <Text className='text-xl py-5 px-5'>Cancel</Text>
        </Pressable>
        <Text className='text-xl font-bold pt-5'>Edit Profile</Text>
        <Pressable disabled={loading} onPress={onSubmit} className='flex-row items-center py-5 px-5'>
          {loading && <ActivityIndicator className='mr-2.5' size='small' color={'#321411'} />}

          <Text className='text-xl text-blue-500'>{hasChanged ? 'Save' : 'Done'}</Text>
        </Pressable>
      </View>

      <KeyboardAwareScrollView enableAutomaticScroll enableOnAndroid>
        {forPet ? getPetEditView() : getOwnerEditView()}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditProfileModal;
