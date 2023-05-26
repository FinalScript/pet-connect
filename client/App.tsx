// App.js
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Auth0Provider } from 'react-native-auth0';
import { Config } from 'react-native-config';
import Auth from './src/pages/Auth';
import PetCreation from './src/pages/PetCreation';
import { setCustomText } from 'react-native-global-props';

const customTextProps = {
  style: {
    fontFamily: 'Itim-Regular',
    color:'red'
  },
};

setCustomText(customTextProps);;

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
        <Stack.Navigator initialRouteName='Pet Creation' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Auth' component={Auth} />
          <Stack.Screen name='Pet Creation' component={PetCreation} />
        </Stack.Navigator>
      </NavigationContainer>
    </Auth0Provider>
  );
};

export default App;
