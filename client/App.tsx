// App.js
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useEffect, useReducer, useState } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PetCreation from './src/pages/PetCreation';
import AccountCreation from './src/pages/AccountCreation';
import Home from './src/pages/Home';
import AppLoader from './src/hoc/AppLoader';
import AuthLoader from './src/pages/AuthLoader';
import { useSelector } from 'react-redux';
import { GeneralReducer } from './src/redux/reducers/generalReducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from './src/components/Text';
import { ping } from './src/api';

export type RootStackParamList = {
  Home: undefined;
  AuthLoader: undefined;
  'Pet Creation'?: {
    initial?: boolean;
  };
  'Account Creation': undefined;
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<RootStackParamList, RouteName>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [apiStatus, setApiStatus] = useState(true);

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
        console.log(err);
        setApiStatus(false);
      });
  };

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
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='AuthLoader'
          screenOptions={{
            headerShown: false,
            headerBackVisible: false,
            animationTypeForReplace: 'push',
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: '#f6f6f6f' },
          }}>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='AuthLoader' component={AuthLoader} />
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
