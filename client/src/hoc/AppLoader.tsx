import React, { ReactNode, useEffect, useState } from 'react';
import { View, SafeAreaView, ActivityIndicator } from 'react-native';
import Config from 'react-native-config';
import { ping, setApiBaseUrl } from '../api';
import { Auth0Provider } from 'react-native-auth0';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Text from '../components/Text';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

interface Props {
  children: ReactNode;
}

export default function AppLoader({ children }: Props) {
  const [domain, setDomain] = useState<string>();
  const [clientId, setClientId] = useState<string>();
  const [error, setError] = useState(false);

  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    if (!Config.API_URL) {
      setError(true);
      return;
    }

    setDomain(Config.AUTH0_DOMAIN);

    setClientId(Config.AUTH0_CLIENT_ID);

    setApiBaseUrl(Config.API_URL);
  };

  if (error || !domain || !clientId) {
    return (
      <SafeAreaView className='bg-themeBg h-full flex justify-center items-center'>
        <Text className='text-themeText font-semibold text-3xl'>An unknown error occured</Text>
      </SafeAreaView>
    );
  }

  return (
    <Provider store={store}>
      <Auth0Provider domain={domain} clientId={clientId}>
        <>{children}</>
      </Auth0Provider>
    </Provider>
  );
}