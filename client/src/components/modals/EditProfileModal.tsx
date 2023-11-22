import { useMutation } from '@apollo/client';
import ReactNativeFile from 'apollo-upload-client/public/ReactNativeFile';
import { uniqueId } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ModalProps, Pressable, TextInput, View } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { useDispatch } from 'react-redux';
import * as env from '../../../env.json';
import { UPDATE_OWNER } from '../../graphql/Owner';
import { OWNER_DATA } from '../../redux/constants';
import { OwnerDAO, PetDAO } from '../../redux/reducers/profileReducer';
import { Ionicon } from '../../utils/Icons';
import Text from '../Text';
import UsernameInput from '../UsernameInput';

interface Props extends ModalProps {
  closeModal: () => void;
  profile: OwnerDAO | PetDAO;
}

const EditProfileModal = ({ closeModal, profile }: Props) => {
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [updateOwner] = useMutation(UPDATE_OWNER);
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
    ImageCropPicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      mediaType: 'photo',
      compressImageMaxHeight: 500,
      compressImageMaxWidth: 500,
    })
      .then((image) => {
        setOwnerFormData((prev) => {
          return { ...prev, profilePicture: image };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const hasChanged = useMemo(() => {
    return (
      ownerFormData.name !== profile?.name ||
      ownerFormData.username !== profile?.username ||
      ownerFormData.profilePicture?.path !== profile?.ProfilePicture?.path ||
      ownerFormData.location !== profile?.location
    );
  }, [ownerFormData, profile]);

  const onSubmit = useCallback(async () => {
    setError('');

    if (hasChanged) {
      setLoading(true);

      setTimeout(async () => {
        const profilePictureFile =
          ownerFormData.profilePicture &&
          ownerFormData.profilePicture.path !== profile?.ProfilePicture.path &&
          new ReactNativeFile({
            uri: ownerFormData.profilePicture.path,
            name: ownerFormData.profilePicture.filename || uniqueId(),
            type: ownerFormData.profilePicture.mime,
          });

        updateOwner({ variables: { ...ownerFormData, profilePicture: profilePictureFile } })
          .then(({ data }) => {
            if (data?.updateOwner) {
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
      }, 1500);
    } else {
      closeModal();
    }
  }, [ownerFormData, hasChanged, isUsernameValid]);

  const getOwnerEditView = () => {
    return (
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
            {ownerFormData?.profilePicture?.path ? (
              <Image
                className='w-full h-full rounded-3xl'
                source={{
                  uri: ownerFormData.profilePicture.width ? ownerFormData.profilePicture.path : env.API_URL + '/' + ownerFormData.profilePicture.path,
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

          <View className='mt-3'>
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
        <Pressable disabled={loading || !isUsernameValid} onPress={onSubmit} className='flex-row items-center py-5 px-5'>
          {loading && <ActivityIndicator className='mr-2.5' size='small' color={'#321411'} />}

          <Text className='text-xl text-blue-500'>{hasChanged ? 'Save' : 'Done'}</Text>
        </Pressable>
      </View>

      {profile?.__typename === 'Owner' && getOwnerEditView()}
    </View>
  );
};

export default EditProfileModal;
