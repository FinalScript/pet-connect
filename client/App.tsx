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
import { getOwnerData, ping, setBearerToken } from './src/api';
import { navigationRef } from './src/services/navigator';
import { useAuth0 } from 'react-native-auth0';
import HomeNavigator from './src/pages/HomePage/HomeNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENT_USER, LOADING, OWNER_DATA, PET_DATA } from './src/redux/constants';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { options } from './src/utils/hapticFeedbackOptions';
import { GeneralReducer } from './src/redux/reducers/generalReducer';
import Loading from './src/pages/Loading';
import GetStarted from './src/pages/GetStarted';
import { StackActions } from '@react-navigation/native';
import { throttle } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileReducer } from './src/redux/reducers/profileReducer';

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getAuth();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [user]);

  useEffect(() => {
    if (owner) {
      navigationRef.dispatch(StackActions.replace('Home'));
    }
  }, [owner]);

  const getAuth = useCallback(async () => {
    if (navigationRef.isReady()) {
      try {
        const token = await AsyncStorage.getItem('@token');
        if (token !== null) {
          setBearerToken(`Bearer ${token}`);
          if (!owner) {
            getUserData();
          }
          return;
        } else {
          getCredentials('openid profile email')
            .then(async (res) => {
              if (!res?.accessToken) {
                dispatch({ type: LOADING, payload: false });
                navigationRef.dispatch(StackActions.replace('Get Started'));
                return;
              }

              setBearerToken(`Bearer ${res.accessToken}`);
              try {
                await AsyncStorage.setItem('@token', res.accessToken);
              } catch (error) {
                // Error saving data
              }
              getUserData();
            })
            .catch((err) => {
              console.log(err);
              return;
            });
        }
      } catch (e) {
        // error reading value
      }
    }
  }, [navigationRef, dispatch]);

  const pingApi = async () => {
    ping()
      .then((res) => {
        if (res.status !== 200) {
          setApiStatus(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setApiStatus(false);
      });
  };

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
      dispatch({ type: OWNER_DATA, payload: (({ Pets, ...o }) => o)(ownerData.data) });
      dispatch({ type: PET_DATA, payload: ownerData.data.Pets });
      dispatch({ type: CURRENT_USER, payload: { id: ownerData.data.id, isPet: false } });
      dispatch({ type: LOADING, payload: false });
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
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName='Loading'
          screenOptions={{
            headerShown: false,
            headerBackVisible: false,
            animationTypeForReplace: 'push',
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: '#f6f6f6f' },
          }}>
          <Stack.Screen name='Loading' component={Loading} />
          <Stack.Screen name='Home' component={HomeNavigator} />
          <Stack.Screen name='Get Started' component={GetStarted} />
          <Stack.Screen name='Pet Creation' component={PetCreation} />
          <Stack.Screen name='Account Creation' component={AccountCreation} />
        </Stack.Navigator>
      </NavigationContainer>
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
