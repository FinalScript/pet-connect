// App.js
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PetCreation from './src/pages/PetCreation';
import AccountCreation from './src/pages/AccountCreation';
import Home from './src/pages/HomePage/Feed';
import AppLoader from './src/hoc/AppLoader';
import AuthLoader from './src/pages/GetStarted';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from './src/components/Text';
import { getOwnerData, ping, setBearerToken, verifyToken } from './src/api';
import { navigationRef } from './src/services/navigator';
import { useAuth0 } from 'react-native-auth0';
import HomeNavigator from './src/pages/HomePage/HomeNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENT_USER, LOADING, LOGOUT, OWNER_DATA, PET_DATA } from './src/redux/constants';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { options } from './src/utils/hapticFeedbackOptions';
import { GeneralReducer } from './src/redux/reducers/generalReducer';
import Loading from './src/pages/Loading';
import GetStarted from './src/pages/GetStarted';
import { StackActions } from '@react-navigation/native';
import { throttle } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileReducer } from './src/redux/reducers/profileReducer';
import { Host } from 'react-native-portalize';

export type RootStackParamList = {
  Loading: undefined;
  Home: undefined;
  'Get Started': undefined;
  'Pet Creation'?: {
    initial?: boolean;
  };
  'Account Creation': undefined;
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<RootStackParamList, RouteName>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const dispatch = useDispatch();
  const [apiStatus, setApiStatus] = useState(true);
  const { user, getCredentials } = useAuth0();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);

  useEffect(() => {
    pingApi();
  }, []);

  const pingApi = async () => {
    const res = await ping();

    if (res.status !== 200) {
      <SafeAreaView className='bg-themeBg h-full flex justify-center items-center'>
        <Text className='text-themeText font-semibold text-3xl'>Error contacting server</Text>
      </SafeAreaView>;
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getAuth();
    }, 200);

    console.log(user);

    return () => clearTimeout(timeoutId);
  }, [user, navigationRef]);

  useEffect(() => {
    if (owner) {
      trigger(HapticFeedbackTypes.notificationSuccess, options);
      navigationRef.dispatch(StackActions.replace('Home'));
    }
  }, [owner?.id]);

  const getAuth = useCallback(async () => {
    if (navigationRef.isReady()) {
      let token;

      try {
        token = await AsyncStorage.getItem('@token');
      } catch (e) {
        console.error(e);
      }

      if (!token) {
        console.log('token not found');
        const credentials = await getCredentials('openid profile email');

        if (!credentials?.accessToken) {
          dispatch({ type: LOADING, payload: false });
          navigationRef.dispatch(StackActions.replace('Get Started'));
          return;
        }

        // TODO
        setBearerToken(`Bearer ${credentials.accessToken}`);

        try {
          await AsyncStorage.setItem('@token', credentials.accessToken);
        } catch (error) {
          // Error saving data
        }

        getUserData();

        return;
      }

      console.log('token found');

      setBearerToken(`Bearer ${token}`);

      try {
        await verifyToken();
      } catch (e: any) {
        console.log(e);
        if (e.response.status) {
          await AsyncStorage.removeItem('@token');
          dispatch({ type: LOADING, payload: false });
          navigationRef.dispatch(StackActions.replace('Get Started'));
          return;
        }
      }

      getUserData();
    }
  }, [navigationRef, dispatch]);

  const getUserData = useCallback(async () => {
    const ownerData = await getOwnerData().catch((err) => {
      if (err.response && err.response.status === 404) {
        dispatch({ type: LOADING, payload: false });
        trigger(HapticFeedbackTypes.notificationWarning, options);
        navigationRef.dispatch(StackActions.replace('Account Creation'));
      }
      return;
    });

    if (!ownerData) {
      dispatch({ type: LOADING, payload: false });
      return;
    }

    if (ownerData.status === 200) {
      const cachedCurrentUser = JSON.parse((await AsyncStorage.getItem('@currentUser')) || '{}');

      const owner = (({ Pets, ...o }) => o)(ownerData.data);
      const pets: any[] = ownerData.data.Pets;

      dispatch({ type: OWNER_DATA, payload: owner });
      dispatch({ type: PET_DATA, payload: pets });

      const validCache = owner?.id === cachedCurrentUser?.id || pets.find((pet) => pet?.id === cachedCurrentUser?.id) ? true : false;

      dispatch({ type: CURRENT_USER, payload: cachedCurrentUser && validCache ? cachedCurrentUser : { id: ownerData.data.id, isPet: false } });
      dispatch({ type: LOADING, payload: false });
    }
  }, [navigationRef, dispatch]);

  return (
    <View className='bg-themeBg h-full'>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Host>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName='Loading'
            screenOptions={{
              headerShown: false,
              headerBackVisible: false,
              animationTypeForReplace: 'push',
              animation: 'fade',
              contentStyle: { backgroundColor: '#f6f6f6f' },
            }}>
            <Stack.Screen name='Loading' component={Loading} />
            <Stack.Screen name='Home' component={HomeNavigator} />
            <Stack.Screen name='Get Started' component={GetStarted} />
            <Stack.Screen name='Pet Creation' component={PetCreation} />
            <Stack.Screen name='Account Creation' component={AccountCreation} />
          </Stack.Navigator>
        </NavigationContainer>
      </Host>
    </View>
  );
};

export default () => {
  return (
    <AppLoader>
      <App />
    </AppLoader>
  );
};
