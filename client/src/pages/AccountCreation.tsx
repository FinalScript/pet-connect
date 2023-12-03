import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, TouchableHighlight, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../App';
import Text from '../components/Text';
import UsernameInput from '../components/UsernameInput';
import { UploadToFirebaseResult, storageFolders, uploadToFirebase } from '../firebase/firebaseStorage';
import { SIGNUP } from '../graphql/Owner';
import { CURRENT_USER, LOADING, OWNER_DATA } from '../redux/constants';
import { GeneralReducer } from '../redux/reducers/generalReducer';
import { FontAwesome } from '../utils/Icons';
import { options } from '../utils/hapticFeedbackOptions';
import Image from '../components/Image';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account Creation'>;

export default function AccountCreation() {
  const dispatch = useDispatch();
  const [signUp] = useMutation(SIGNUP);
  const loading = useSelector((state: GeneralReducer) => state.general.loading);
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState<string>();
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [name, setName] = useState<string>();
  const [profilePicture, setProfilePicture] = useState<Asset>();
  const nameRef = useRef<TextInput>(null);
  const [focus, setFocus] = useState({ username: false, name: false });

  useEffect(() => {
    dispatch({ type: LOADING, payload: false });
  }, []);

  const pickProfilePicture = useCallback(async () => {
    launchImageLibrary({
      mediaType: 'photo',
    })
      .then((image) => {
        setProfilePicture(image.assets?.[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const nextOnPress = useCallback(async () => {
    if (isUsernameValid && username) {
      trigger(HapticFeedbackTypes.impactMedium, options);
      dispatch({ type: LOADING, payload: true });

      let profilePictureData: UploadToFirebaseResult;

      if (profilePicture) {
        const uploadRes = await uploadToFirebase(profilePicture, storageFolders.PROFILE_PICTURES);

        if (uploadRes) {
          profilePictureData = uploadRes;
        }
      }

      setTimeout(() => {
        signUp({
          variables: {
            username: username.toLowerCase(),
            name,
            profilePicture: profilePictureData,
          },
        })
          .then(async ({ data }) => {
            if (data?.signup.owner) {
              dispatch({ type: OWNER_DATA, payload: data.signup.owner });
              dispatch({ type: CURRENT_USER, payload: { id: data.signup.owner.id, isPet: false } });
              navigation.replace('Pet Creation', { initial: true });
            }
          })
          .catch((err) => {
            console.log(JSON.stringify(err, null, 2));
          })
          .finally(() => {
            dispatch({ type: LOADING, payload: false });
          });
      }, 500);
    }
  }, [isUsernameValid, username, name, profilePicture, loading]);

  const focusNameInput = () => {
    nameRef.current?.focus();
  };

  return (
    <Pressable onPress={Keyboard.dismiss}>
      <SafeAreaView className='bg-themeBg h-full p-5 flex flex-col justify-between'>
        <KeyboardAwareScrollView enableAutomaticScroll enableOnAndroid keyboardOpeningTime={450}>
          <View>
            <Text className='text-themeText font-semibold text-3xl'>We need more details about you to finish up your account!</Text>
            <View className='mt-5 px-2'>
              <View className='mb-5 flex flex-col justify-center items-center'>
                <Text className='mb-2 text-xl font-bold text-themeText'>Profile Picture</Text>
                <TouchableHighlight
                  className='w-[160px] h-[160px] bg-themeInput rounded-3xl shadow-sm shadow-themeShadow'
                  underlayColor={'#d6cbcb'}
                  onPress={pickProfilePicture}
                  disabled={loading}>
                  <View className=''>
                    {profilePicture ? (
                      <Image className='flex w-full h-full rounded-3xl' source={{ uri: profilePicture?.uri }} />
                    ) : (
                      <View className='flex flex-row justify-center items-center h-full'>
                        <FontAwesome name='plus-square-o' size={50} color={'#362013'} />
                      </View>
                    )}
                  </View>
                </TouchableHighlight>
              </View>
              <View className='mt-3'>
                <Text className='mb-2 pl-4 text-lg font-bold text-themeText'>What is your name?</Text>
                <TextInput
                  ref={nameRef}
                  className={
                    (focus.name === true ? 'border-themeActive' : 'border-transparent') +
                    ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-lg'
                  }
                  style={{ fontFamily: 'BalooChettan2-Regular' }}
                  placeholderTextColor={'#444444bb'}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => {
                    setFocus((prev) => {
                      return { ...prev, name: true };
                    });
                  }}
                  onBlur={() => {
                    setFocus((prev) => {
                      return { ...prev, name: false };
                    });
                  }}
                  autoCorrect={false}
                  autoComplete='name'
                  maxLength={30}
                  returnKeyType='done'
                  placeholder='Enter your name'
                  editable={!loading}
                />
              </View>
              <View className='mt-5'>
                <View>
                  <Text className='mb-2 pl-4 text-lg font-bold text-themeText'>Give yourself a username.</Text>
                  <UsernameInput
                    value={username}
                    setValue={setUsername}
                    isValid={isUsernameValid}
                    setIsValid={setIsUsernameValid}
                    focusNext={focusNameInput}
                    maxLength={30}
                    placeholder='Enter your username'
                    returnKeyType='next'
                    forOwner
                    prefix
                  />
                </View>
                <View className='mt-4'>
                  <Text className='text-xs pl-3'>- No spaces</Text>
                  <Text className='text-xs pl-3'>- Dashes, underscores, and periods allowed</Text>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {isUsernameValid && (
          <View className='mb-2 mx-2 flex flex-row justify-end items-center'>
            <TouchableHighlight
              className='bg-themeBtn rounded-3xl shadow-sm shadow-themeShadow'
              underlayColor={'#c59071'}
              onPress={nextOnPress}
              disabled={loading}>
              <View className='px-6 py-1 flex flex-row justify-center items-center'>
                {loading && <ActivityIndicator className='mr-2 -ml-2' size='small' color={'#321411'} />}
                <Text className='text-xl font-semibold text-themeText'>Next</Text>
              </View>
            </TouchableHighlight>
          </View>
        )}
      </SafeAreaView>
    </Pressable>
  );
}
