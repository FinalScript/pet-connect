import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ReactNode, useEffect, useState } from 'react';
import { Auth0Provider } from 'react-native-auth0';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import createUploadLink from 'apollo-upload-client/public/createUploadLink';
import React from 'react';
import * as env from '../../env.json';
import { setApiBaseUrl, setBearerToken } from '../api';
import Loading from '../pages/Loading';

interface Props {
  children: ReactNode;
}

export default function AppLoader({ children }: Props) {
  const [domain, setDomain] = useState<string>();
  const [clientId, setClientId] = useState<string>();
  const [error, setError] = useState(false);
  const [token, setToken] = useState<string>();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const fetchedToken = await AsyncStorage.getItem('@token');

    if (fetchedToken) {
      setToken(fetchedToken);
      setBearerToken(`Bearer ${fetchedToken}`);
    }

    if (!Config.API_URL) {
      setError(true);
      return;
    }

    setDomain(Config.AUTH0_DOMAIN);

    setClientId(Config.AUTH0_CLIENT_ID);

    setApiBaseUrl(env.API_URL);
  };

  const httpLink = createUploadLink({ uri: `${env.API_URL}/graphql` });

  const withToken = setContext(async () => {
    const token = await AsyncStorage.getItem('@token');
    return { token };
  });

  const authMiddleware = new ApolloLink((operation, forward) => {
    const { token } = operation.getContext();
    operation.setContext(() => ({
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'apollo-require-preflight': true,
      },
    }));

    return forward(operation);
  });

  const link = ApolloLink.from([withToken, authMiddleware.concat(httpLink)]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  if (error || !domain || !clientId) {
    return <Loading />;
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
