import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableHighlight, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/Text';
import { TextInput } from 'react-native-gesture-handler';
import { HapticFeedbackTypes, HapticOptions, trigger } from 'react-native-haptic-feedback';
import UsernameInput from '../components/UsernameInput';
import { signup } from '../api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { options } from '../utils/hapticFeedbackOptions';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralReducer } from '../redux/reducers/generalReducer';
import { LOADING, OWNER_DATA, PET_DATA } from '../redux/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account Creation'>;

export default function AccountCreation() {
  const dispatch = useDispatch();
  const loading = useSelector((state: GeneralReducer) => state.general.loading);
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState<string>();
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [name, setName] = useState<string>();
  const nameRef = useRef<TextInput>(null);
  const [focus, setFocus] = useState({ username: false, name: false });

  useEffect(() => {
    dispatch({ type: LOADING, payload: false });
  }, []);

  const nextOnPress = useCallback(() => {
    if (isUsernameValid && username) {
      trigger(HapticFeedbackTypes.impactMedium, options);
      dispatch({ type: LOADING, payload: true });

      setTimeout(() => {
        signup({ username: username.toLowerCase(), name })
          .then((res) => {
            console.log(res.status, res.data);

            if (res.status === 200) {
              dispatch({ type: OWNER_DATA, payload: (({ Pets, ...o }) => o)(res.data.dataValues) });
              navigation.replace('Pet Creation', { initial: true });
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            dispatch({ type: LOADING, payload: false });
          });
      }, 1500);
    }
  }, [isUsernameValid, username, name, loading]);

  const focusNameInput = () => {
    nameRef.current?.focus();
  };

  return (
    <SafeAreaView className='bg-themeBg h-full p-5 flex flex-col justify-between'>
      <View>
        <Text className='text-themeText font-semibold text-3xl'>We need more details about you to finish up your account!</Text>

        <View className='mt-5 px-2'>
          <View>
            <UsernameInput value={username} setValue={setUsername} isValid={isUsernameValid} setIsValid={setIsUsernameValid} focusNext={focusNameInput} />
            <View>
              <Text className='text-xs pl-3'>- No spaces</Text>
              <Text className='text-xs pl-3'>- Dashes, underscores, and periods allowed</Text>
            </View>
          </View>

          <View className='mt-5'>
            <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Name</Text>
            <TextInput
              ref={nameRef}
              className={
                (focus.name === true ? 'border-themeActive' : 'border-transparent') +
                ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-xl'
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
        </View>
      </View>

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
  );
}
