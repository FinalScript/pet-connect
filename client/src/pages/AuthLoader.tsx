import React, { ReactNode, useCallback, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableHighlight } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralReducer } from '../redux/reducers/generalReducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth0 } from 'react-native-auth0';
import { getOwnerData, setBearerToken } from '../api';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { options } from '../utils/hapticFeedbackOptions';
import { LOADING } from '../redux/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuthLoader'>;

export default function AuthLoader() {
  const dispatch = useDispatch();
  const loading = useSelector((state: GeneralReducer) => state.general.loading);
  const navigation = useNavigation<NavigationProp>();
  const { authorize, user, getCredentials } = useAuth0();

  useEffect(() => {
    getCredentials('openid profile email')
      .then((res) => {
        if (!res) {
          dispatch({ type: LOADING, payload: false });
          return;
        }

        if (!res.accessToken || !user) {
          return;
        }
        
        setBearerToken(`Bearer ${res.accessToken}`);
        getAuth();
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [user]);

  const login = async () => {
    trigger(HapticFeedbackTypes.impactHeavy, options);
    authorize({ scope: 'openid profile email', audience: 'https://pet-app.com/api/v2' });
  };

  const getAuth = useCallback(async () => {
    const ownerData = await getOwnerData().catch((err) => {
      if (err.response && err.response.status === 404) {
        dispatch({ type: LOADING, payload: false });
        trigger(HapticFeedbackTypes.notificationWarning, options);
        navigation.replace('Account Creation');
      }
      return;
    });

    if (!ownerData) {
      dispatch({ type: LOADING, payload: false });
      return;
    }

    if (ownerData.status === 200) {
      dispatch({ type: LOADING, payload: false });
      trigger(HapticFeedbackTypes.notificationSuccess, options);
      navigation.replace('Home');
    }
  }, [navigation, dispatch]);

  if (loading) {
    return (
      <SafeAreaView className='bg-themeBg h-full flex justify-center items-center'>
        <ActivityIndicator className='mr-2 -ml-2' size='small' color={'#321411'} />
      </SafeAreaView>
    );
  }

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
