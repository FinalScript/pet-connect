import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ReactNode, useEffect, useState } from 'react';
import { Auth0Provider } from 'react-native-auth0';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../redux/store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import createUploadLink from 'apollo-upload-client/public/createUploadLink';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { ping, setAxiosBaseURL, setBearerToken } from '../api';
import Text from '../components/Text';
import DeveloperPanel from '../pages/DeveloperPanel';
import Loading from '../pages/Loading';
import { DEVELOPER_PANEL_OPEN } from '../redux/constants';

interface Props {
  children: ReactNode;
}

export default function AppLoader({ children }: Props) {
  const [apiStatus, setApiStatus] = useState(true);
  const [domain, setDomain] = useState<string>();
  const [clientId, setClientId] = useState<string>();
  const [apiUrl, setApiUrl] = useState<string>();
  const [link, setLink] = useState<ApolloLink>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    load();
  }, []);

  const pingApi = async () => {
    ping()
      .then((res) => {
        if (res.status === 200) {
          setApiStatus(true);
        } else {
          setApiStatus(false);
        }
      })
      .catch((err) => {
        console.warn(err);
        setApiStatus(false);
      });
  };

  useEffect(() => {
    if (!apiUrl) {
      return;
    }

    setAxiosBaseURL(apiUrl);
    pingApi();

    const httpLink = createUploadLink({ uri: `${apiUrl}/graphql` });

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

    setLink(ApolloLink.from([withToken, authMiddleware.concat(httpLink)]));
  }, [apiUrl]);

  const load = async () => {
    const fetchedToken = await AsyncStorage.getItem('@token');

    if (fetchedToken) {
      setToken(fetchedToken);
      setBearerToken(`Bearer ${fetchedToken}`);
    }

    const fetchedApiUrl = await AsyncStorage.getItem('@API_URL');

    if (fetchedApiUrl) {
      setApiUrl(fetchedApiUrl);
    } else {
      setApiUrl('http://localhost:3000');
    }

    setDomain(Config.AUTH0_DOMAIN);

    setClientId(Config.AUTH0_CLIENT_ID);
  };

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  if (!domain || !clientId) {
    return <Loading />;
  }

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Auth0Provider domain={domain} clientId={clientId}>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <DeveloperPanel apiUrl={{ set: setApiUrl, value: apiUrl }} />

              {!apiStatus ? <ErrorContactingServer /> : <>{children}</>}
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </Auth0Provider>
      </Provider>
    </ApolloProvider>
  );
}

const ErrorContactingServer = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView className='bg-themeBg h-full flex justify-center items-center'>
      <Text className='text-themeText font-semibold text-3xl'>Error contacting server</Text>

      {__DEV__ && (
        <PressableOpacity
          activeOpacity={0.8}
          className='mt-14 bg-green-400 px-6 py-3 rounded-xl'
          onPress={() => {
            dispatch({ type: DEVELOPER_PANEL_OPEN, payload: true });
          }}>
          <Text className='text-xl font-bold text-themeText text-center'>Open Developer Panel</Text>
        </PressableOpacity>
      )}
    </SafeAreaView>
  );
};
