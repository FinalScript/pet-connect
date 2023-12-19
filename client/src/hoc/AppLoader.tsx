import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as eva from '@eva-design/eva';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import createUploadLink from 'apollo-upload-client/public/createUploadLink';
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, Modal, Pressable, SafeAreaView, View } from 'react-native';
import { Auth0Provider } from 'react-native-auth0';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import LanPortScanner, { LSScanConfig, LSSingleScanResult } from 'react-native-lan-port-scanner';
import { PaperProvider } from 'react-native-paper';
import { PressableOpacity } from 'react-native-pressable-opacity';
import SplashScreen from 'react-native-splash-screen';
import { Provider, useDispatch } from 'react-redux';
import { ping, setAxiosBaseURL, setBearerToken } from '../api';
import Text from '../components/Text';
import DeveloperPanel from '../pages/DeveloperPanel';
import Loading from '../pages/Loading';
import { DEVELOPER_PANEL_OPEN } from '../redux/constants';
import { store } from '../redux/store';
import { Feather, Ionicon } from '../utils/Icons';
import { options } from '../utils/hapticFeedbackOptions';

LogBox.ignoreLogs([
  'socketDidDisconnect with nil clientDelegate for ',
  "Module TcpSockets requires main queue setup since it overrides `init` but doesn't implement `requiresMainQueueSetup`. In a future release React Native will default to initializing all native modules on a background thread unless explicitly opted-out of.",
  "Modal with 'formSheet' presentation style and 'transparent' value is not supported.",
  "Modal with 'pageSheet' presentation style and 'transparent' value is not supported.",
]);

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
  const [availableConnections, setAvailableConnections] = useState<LSSingleScanResult[]>([]);
  const [availableConnectionModal, setAvailableConnectionModal] = useState(false);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    console.log(Config);
    if (apiStatus) {
      return;
    }

    if (Config.APP_CONFIG === 'production') {
      setApiUrl(Config.API_URL);
      return;
    }

    SplashScreen.hide();

    let cancelScanHandle: any;

    LanPortScanner.getNetworkInfo().then((networkInfo) => {
      const config1: LSScanConfig = {
        networkInfo: networkInfo,
        ports: [54321], //Specify port here
        timeout: 1000, //Timeout for each thread in ms
        threads: 10, //Number of threads
        logging: false,
      };

      //Either config1 or config2 required
      cancelScanHandle = LanPortScanner.startScan(
        config1, //or config2
        (totalHosts: number, hostScanned: number) => {},
        (result) => {
          if (result?.ip && !availableConnections.includes(result)) {
            setAvailableConnections((prev) => [...prev, result]);
            cancelScanHandle();
          }
        },
        (results) => {}
      );
    });

    //You can cancel scan later
    setTimeout(() => {
      cancelScanHandle();
    }, 30000);

    return () => {
      cancelScanHandle();
    };
  }, [apiStatus]);

  useEffect(() => {
    if (availableConnections[0]?.ip) {
      trigger(HapticFeedbackTypes.impactMedium, options);

      setAvailableConnectionModal(true);
    }
  }, [availableConnections]);

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
        console.log(err);
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

    console.log(fetchedToken);
    if (fetchedToken) {
      setToken(fetchedToken);
      setBearerToken(`Bearer ${fetchedToken}`);
    }

    const fetchedApiUrl = await AsyncStorage.getItem('@API_URL');

    if (fetchedApiUrl) {
      setApiUrl(fetchedApiUrl);
    } else {
      setApiUrl(Config.API_URL);
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
          <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.dark}>
              <PaperProvider
                settings={{
                  icon: (props) => <Ionicon {...props} />,
                }}>
                <GestureHandlerRootView>
                  <BottomSheetModalProvider>
                    {!apiStatus && (
                      <AvailableConnection
                        modalOpen={availableConnectionModal}
                        setModalOpen={setAvailableConnectionModal}
                        availableConnections={availableConnections}
                        setApiUrl={setApiUrl}
                      />
                    )}
                    {Config.API_URL === 'development' && <DeveloperPanel apiUrl={{ set: setApiUrl, value: apiUrl }} />}

                    {!apiStatus ? <ErrorContactingServer /> : <>{children}</>}
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </PaperProvider>
            </ApplicationProvider>
          </>
        </Auth0Provider>
      </Provider>
    </ApolloProvider>
  );
}

interface AvailableConnectionProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setApiUrl: Dispatch<SetStateAction<string | undefined>>;
  availableConnections: LSSingleScanResult[];
}
const AvailableConnection = ({ modalOpen, setModalOpen, availableConnections, setApiUrl }: AvailableConnectionProps) => {
  return (
    <Modal
      style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      visible={modalOpen}
      presentationStyle='pageSheet'
      animationType='slide'
      transparent={true}
      onRequestClose={() => {
        setModalOpen(false);
      }}>
      <View className='flex items-center bottom-0 absolute w-full h-[40%] rounded-t-3xl px-2 py-5 bg-themeBg'>
        <View className='flex items-center mt-3'>
          <Text className='text-3xl font-bold text-center'>Device found with port</Text>
          <Text className='text-3xl font-bold mt-3 text-blue-500'>54321</Text>
        </View>

        <Pressable
          onPress={async () => {
            trigger(HapticFeedbackTypes.impactMedium, options);
            await AsyncStorage.setItem('@API_URL', `http://${availableConnections[0]?.ip}:54321`);
            setModalOpen(false);
            setApiUrl(`http://${availableConnections[0]?.ip}:54321`);
          }}
          className='mt-10 bg-green-400 px-5 py-3 rounded-xl w-auto shadow-md flex-row items-center'>
          <Feather name='wifi' size={25} />
          <Text className='text-2xl font-medium ml-3'>Connect to {availableConnections[0]?.ip}</Text>
        </Pressable>

        {/* <View className='mt-5 flex gap-3 px-10'>
          {availableConnections.map((connection, i) => {
            return (
              <Pressable key={i} className='bg-themeInput px-5 py-3 rounded-xl shadow'>
                <Text className='text-3xl'>{connection.ip}</Text>
              </Pressable>
            );
          })}
        </View> */}
      </View>
    </Modal>
  );
};

const ErrorContactingServer = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView className='bg-themeBg h-full flex justify-center items-center'>
      <Text className='text-themeText font-bold text-3xl'>Error contacting server</Text>

      <>
        <PressableOpacity
          activeOpacity={0.8}
          className='mt-14 bg-green-400 px-6 py-3 rounded-xl'
          onPress={() => {
            dispatch({ type: DEVELOPER_PANEL_OPEN, payload: true });
          }}>
          <Text className='text-xl font-bold text-themeText text-center'>Open Developer Panel</Text>
        </PressableOpacity>

        <View className='absolute bottom-10'>
          <ActivityIndicator size={'small'} />
          <Text className='mt-5'>Searching for local devices with port 54321</Text>
        </View>
      </>
    </SafeAreaView>
  );
};
