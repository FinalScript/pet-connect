// App.js
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, useEffect, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import {Config} from 'react-native-config';
import Auth from './src/pages/Auth';
import Profile from './src/pages/Profile';

const Stack = createNativeStackNavigator();

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
        <Stack.Navigator initialRouteName='Auth'>
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </Auth0Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default App;
