// App.js
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { useLazyQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, RouteProp, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Host } from 'react-native-portalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ping } from './src/api';
import Text from './src/components/Text';
import { GET_OWNER } from './src/graphql/Owner';
import AppLoader, { TokenContext } from './src/hoc/AppLoader';
import AccountCreation from './src/pages/AccountCreation';
import GetStarted from './src/pages/GetStarted';
import HomeNavigator from './src/pages/HomePage/HomeNavigator';
import Loading from './src/pages/Loading';
import PetCreation from './src/pages/PetCreation';
import { LOADING } from './src/redux/constants';
import { ProfileReducer } from './src/redux/reducers/profileReducer';
import { navigationRef } from './src/services/navigator';
import { options } from './src/utils/hapticFeedbackOptions';

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
  const { setToken } = useContext(TokenContext);
  const [apiStatus, setApiStatus] = useState(true);
  const [getUserData, { data: userData, loading: userDataLoading, error: userDataError }] = useLazyQuery(GET_OWNER);
  const { user, getCredentials } = useAuth0();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);

  useEffect(() => {
    pingApi();
  }, []);

  const pingApi = async () => {
    ping()
      .then((res) => {
        if (res.status !== 200) {
          setApiStatus(false);
        }
      })
      .catch((err) => {
        setApiStatus(false);
      });
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

  useEffect(() => {
    handleUserData();
  }, [userData, userDataLoading, dispatch, navigationRef, userDataError]);

  const handleUserData = useCallback(async () => {
    if (userDataError && !userDataLoading) {
      if (userDataError.message === 'Owner not found') {
        dispatch({ type: LOADING, payload: false });
        trigger(HapticFeedbackTypes.notificationWarning, options);
        navigationRef.dispatch(StackActions.replace('Account Creation'));
      }
      return;
    }

    if (userDataLoading) {
      dispatch({ type: LOADING, payload: true });
      return;
    } else {
      dispatch({ type: LOADING, payload: false });
    }

    if (userData && !userDataLoading) {
      console.log(userData);

      // const cachedCurrentUser = JSON.parse((await AsyncStorage.getItem('@currentUser')) || '{}');

      // const owner = (({ Pets, ...o }) => o)(userData.getOwner.owner);
      // const pets: any[] = ownerData.data.Pets;

      // dispatch({ type: OWNER_DATA, payload: owner });
      // dispatch({ type: PET_DATA, payload: pets });

      // const validCache = owner?.id === cachedCurrentUser?.id || pets.find((pet) => pet?.id === cachedCurrentUser?.id) ? true : false;

      // dispatch({ type: CURRENT_USER, payload: cachedCurrentUser && validCache ? cachedCurrentUser : { id: ownerData.data.id, isPet: false } });
      // dispatch({ type: LOADING, payload: false });
    }
  }, [userData, userDataLoading, dispatch, navigationRef, userDataError]);

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
        setToken(`${credentials.accessToken}`);

        try {
          await AsyncStorage.setItem('@token', credentials.accessToken);
        } catch (error) {
          // Error saving data
        }

        getUserData();

        return;
      }

      console.log('token found');

      setToken(`${token}`);

      // TODO

      // try {
      //   await verifyToken();
      // } catch (e: any) {
      //   console.log(e);
      //   if (e.response.status) {
      //     await AsyncStorage.removeItem('@token');
      //     dispatch({ type: LOADING, payload: false });
      //     navigationRef.dispatch(StackActions.replace('Get Started'));
      //     return;
      //   }
      // }

      getUserData();
    }
  }, [navigationRef, dispatch]);

  if (!apiStatus) {
    return (
      <SafeAreaView className='bg-themeBg h-full flex justify-center items-center'>
        <Text className='text-themeText font-semibold text-3xl'>Error contacting server</Text>
      </SafeAreaView>
    );
  }

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
