import React, { useEffect, useCallback } from 'react';
import { View, Text, Button, Image, TouchableHighlight } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { getOwnerData, setBearerToken } from '../api';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { options } from '../utils/hapticFeedbackOptions';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function Auth() {
  const navigation = useNavigation<NavigationProp>();
  const { authorize, clearSession, user, getCredentials } = useAuth0();

  useEffect(() => {
    if (user) {
      getAuth();
    }
  }, [user]);

  const getAuth = useCallback(() => {
    getCredentials('openid profile email').then(async (auth) => {
      if (auth && auth.accessToken) {
        setBearerToken(`Bearer ${auth.accessToken}`);
        getOwnerData()
          .then((res) => {
            trigger(HapticFeedbackTypes.notificationSuccess, options);
            navigation.replace('Home');
          })
          .catch((err) => {
            console.log(err);
            if (err.response && err.response.status === 404) {
              trigger(HapticFeedbackTypes.notificationWarning, options);
              navigation.replace('Account Creation');
            }
          });
      } else {
        login();
      }
    });
  }, [navigation]);

  const login = async () => {
    trigger(HapticFeedbackTypes.impactHeavy, options);
    authorize({ scope: 'openid profile email', audience: 'https://pet-app.com/api/v2' });
  };

  return (
    <SafeAreaView className='bg-themeBg h-full p-5 flex flex-col justify-between'>
      <View className='flex flex-col items-center justify-center'>
        <View className={'w-[250px] h-[250px]'}>
          <Image className='flex w-full h-full aspect-square shadow-md shadow-themeShadowLight' source={require('../../assets/img/cat-logo.png')} />
        </View>
        <Text className='mt-5 text-themeText font-semibold text-5xl'>Welcome!</Text>
      </View>

      <View className='mx-5 mb-5'>
        <TouchableHighlight className='bg-themeBtn rounded-3xl shadow-sm shadow-themeShadow' underlayColor={'#c59071'} onPress={login}>
          <View className='px-5 py-2 flex flex-row justify-center items-center'>
            <Text className='text-2xl font-semibold text-themeText'>Get Started</Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}
