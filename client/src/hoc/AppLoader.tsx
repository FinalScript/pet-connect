import { ReactNode, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import Config from 'react-native-config';
import { setApiBaseUrl } from '../api';
import { Auth0Provider } from 'react-native-auth0';
import Text from '../components/Text';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

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
    console.log(Config);
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
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <>{children}</>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </Auth0Provider>
    </Provider>
  );
}
