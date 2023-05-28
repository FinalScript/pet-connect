import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import Text from '../components/Text';
import { TextInput } from 'react-native-gesture-handler';
import { HapticFeedbackTypes, HapticOptions, trigger } from 'react-native-haptic-feedback';
import UsernameInput from '../components/UsernameInput';
import { signup } from '../api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const options: HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account Creation'>;

export default function AccountCreation() {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState<string>();
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [name, setName] = useState<string>();
  const [focus, setFocus] = useState({ username: false, name: false });

  const nextOnPress = useCallback(() => {
    if (isUsernameValid && username) {
      signup({ username: username.toLowerCase(), name })
        .then((res) => {
          console.log(res.status, res.data);

          if (res.status === 200) {
            navigation.replace('Pet Creation');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    trigger(HapticFeedbackTypes.impactMedium, options);
  }, [isUsernameValid, username, name]);

  return (
    <SafeAreaView className='bg-[#fde1da] h-screen p-5 flex flex-col justify-between'>
      <View>
        <Text className='text-[#232323] font-semibold text-3xl'>We need more details about you to finish up your account!</Text>

        <View className='mt-10'>
          <View>
            <UsernameInput value={username} setValue={setUsername} isValid={isUsernameValid} setIsValid={setIsUsernameValid} />
            <View>
              <Text>- No spaces</Text>
              <Text>- Dashes, underscores, and periods allowed</Text>
            </View>
          </View>

          <View className='mt-5'>
            <Text className='mb-2 pl-4 text-xl font-bold text-[#000000bb]'>Name</Text>
            <TextInput
              className={
                (focus.name === true ? 'border-[#FFBA93]' : 'border-transparent') +
                ' bg-[#fff4f3] border-[5px] shadow-md shadow-[#e47167a2] rounded-3xl px-5 text-lg'
              }
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

      <View className='mb-5 mx-2 flex flex-row justify-end items-center'>
        <TouchableOpacity onPress={nextOnPress}>
          <View className='bg-[#FFBA93] px-6 py-1 rounded-3xl  flex flex-row justify-center items-center'>
            <Text className='text-xl font-semibold text-black'>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
