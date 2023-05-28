// App.js
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Auth0Provider } from 'react-native-auth0';
import { Config } from 'react-native-config';
import Auth from './src/pages/Auth';
import PetCreation from './src/pages/PetCreation';
import AccountCreation from './src/pages/AccountCreation';
import Home from './src/pages/Home';
import { setApiBaseUrl } from './src/api';

export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  'Pet Creation': undefined;
  'Account Creation': undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [domain, setDomain] = useState<string>();
  const [clientId, setClientId] = useState<string>();

  useEffect(() => {
    if (Config.AUTH0_DOMAIN) {
      setDomain(Config.AUTH0_DOMAIN);
    }

    if (Config.AUTH0_CLIENT_ID) {
      setClientId(Config.AUTH0_CLIENT_ID);
    }

    if (Platform.OS === 'ios') {
      setApiBaseUrl('http://localhost:3000');
    }
  }, []);

  if (!domain || !clientId) {
    return (
      <SafeAreaView>
        <Text>Error</Text>
      </SafeAreaView>
    );
  }

  return (
    <Auth0Provider domain={domain} clientId={clientId}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Auth' screenOptions={{ headerShown: false, headerBackVisible: false }}>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Auth' component={Auth} />
          <Stack.Screen name='Pet Creation' component={PetCreation} />
          <Stack.Screen name='Account Creation' component={AccountCreation} />
        </Stack.Navigator>
      </NavigationContainer>
    </Auth0Provider>
  );
};

export default App;
