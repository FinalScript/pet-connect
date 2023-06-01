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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account Creation'>;

export default function AccountCreation() {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState<string>();
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [name, setName] = useState<string>();
  const nameRef = useRef<TextInput>(null);
  const [focus, setFocus] = useState({ username: false, name: false });
  const [isLoading, setIsLoading] = useState(false);

  const nextOnPress = useCallback(() => {
    if (isUsernameValid && username) {
      trigger(HapticFeedbackTypes.impactMedium, options);
      setIsLoading(true);

      setTimeout(() => {
        signup({ username: username.toLowerCase(), name })
          .then((res) => {
            console.log(res.status, res.data);

            if (res.status === 200) {
              navigation.replace('Pet Creation');
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 1500);
    }
  }, [isUsernameValid, username, name]);

  const focusNameInput = () => {
    nameRef.current?.focus();
  };

  return (
    <SafeAreaView className='bg-[#fde1da] h-full p-5 flex flex-col justify-between'>
      <View>
        <Text className='text-[#232323] font-semibold text-3xl'>We need more details about you to finish up your account!</Text>

        <View className='mt-5 px-2'>
          <View>
            <UsernameInput value={username} setValue={setUsername} isValid={isUsernameValid} setIsValid={setIsUsernameValid} focusNext={focusNameInput} />
            <View>
              <Text className='text-xs pl-3'>- No spaces</Text>
              <Text className='text-xs pl-3'>- Dashes, underscores, and periods allowed</Text>
            </View>
          </View>

          <View className='mt-5'>
            <Text className='mb-2 pl-4 text-xl font-bold text-[#000000bb]'>Name</Text>
            <TextInput
              ref={nameRef}
              className={
                (focus.name === true ? 'border-[#FFBA93]' : 'border-transparent') +
                ' bg-[#fff4f3] border-[5px] shadow-sm shadow-[#fa6b5e46] w-full rounded-3xl px-5 py-3 text-xl'
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
              placeholder='Enter your name'
            />
          </View>
        </View>
      </View>

      {isUsernameValid && (
        <View className='mb-5 mx-2 flex flex-row justify-end items-center'>
          <TouchableHighlight
            className='bg-[#FFBA93] rounded-3xl shadow-sm shadow-[#fa6b5e46]'
            underlayColor={'#c59071'}
            onPress={nextOnPress}
            disabled={isLoading}>
            <View className='px-5 py-1 flex flex-row justify-center items-center'>
              {isLoading && <ActivityIndicator className='mr-2 -ml-2' size='small' color={'#321411'} />}
              <Text className='text-xl font-semibold text-black'>Next</Text>
            </View>
          </TouchableHighlight>
        </View>
      )}
    </SafeAreaView>
  );
}
