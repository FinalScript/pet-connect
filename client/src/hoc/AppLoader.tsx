import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ReactNode, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Auth0Provider } from 'react-native-auth0';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import Text from '../components/Text';
import { store } from '../redux/store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import * as env from '../../env.json';
import { setApiBaseUrl, setBearerToken } from '../api';

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

    setApiBaseUrl(env.API_URL);
  };

  const httpLink = createHttpLink({
    uri: `${env.API_URL}/graphql`,
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem('@token');

    setBearerToken(`Bearer ${token}`);

    return {
      headers: {
        ...headers,
        authorization: token && `Bearer ${token}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  if (error || !domain || !clientId) {
    return (
      <SafeAreaView className='bg-themeBg h-full flex justify-center items-center'>
        <Text className='text-themeText font-semibold text-3xl'>An unknown error occured</Text>
      </SafeAreaView>
    );
  }

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Auth0Provider domain={domain} clientId={clientId}>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <>{children}</>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </Auth0Provider>
      </Provider>
    </ApolloProvider>
  );
}
