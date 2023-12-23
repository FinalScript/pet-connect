import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { Button, View } from 'react-native';
import { RootStackParamList } from '../../App';
import Text from '../components/Text';
import Config from 'react-native-config';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { DEVELOPER_PANEL_OPEN, LOGOUT } from '../redux/constants';
import { useDispatch } from 'react-redux';
import { useAuth0 } from 'react-native-auth0';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings Page', undefined>;
}

const SettingsPage = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { clearSession } = useAuth0();

  const logout = useCallback(async () => {
    try {
      await clearSession({}, { skipLegacyListener: true });

      dispatch({ type: LOGOUT });
      navigation.replace('Get Started');
    } catch (e) {
      console.log(e);
      console.log('Log out cancelled');
    }
  }, [dispatch, navigation]);

  return (
    <SafeAreaView className='flex w-full h-full px-5 py-5 bg-themeBg'>
      {Config.APP_CONFIG === 'development' && (
        <PressableOpacity
          activeOpacity={0.8}
          className='mt-5 bg-green-400 px-6 py-3 rounded-xl'
          onPress={() => {
            setTimeout(() => {
              dispatch({ type: DEVELOPER_PANEL_OPEN, payload: true });
            }, 100);
          }}>
          <Text className='text-xl font-bold text-themeText text-center'>Open Developer Panel</Text>
        </PressableOpacity>
      )}
      <View>
        <PressableOpacity
          className='mt-5 bg-red-400 px-6 py-3 rounded-xl'
          onPress={() => {
            logout();
          }}>
          <Text className='text-xl font-bold text-themeText text-center'>Logout</Text>
        </PressableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsPage;
