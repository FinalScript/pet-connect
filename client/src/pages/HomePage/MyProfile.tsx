import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import { Modal, Pressable, SafeAreaView, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import Text from '../../components/Text';
import AccountSwitcherModal from '../../components/modals/AccountSwitcherModal';
import SettingsModal from '../../components/modals/SettingsModal';
import { LOGOUT } from '../../redux/constants';
import { OwnerDAO, ProfileReducer } from '../../redux/reducers/profileReducer';
import { FontAwesome, Ionicon } from '../../utils/Icons';
import { themeConfig } from '../../utils/theme';
import OwnerProfile from '../OwnerProfilePage/OwnerProfile';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
}

const MyProfile = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const { clearSession } = useAuth0();
  const [modals, setModals] = useState({ accountSwitcher: false, settings: false, editProfile: false });
  const accountSwitcherModalRef = useRef<Modalize>(null);

  const setSettingsModalVisible = useCallback((bool: boolean) => {
    setModals((prev) => {
      return { ...prev, settings: bool };
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearSession({}, { skipLegacyListener: true });

      dispatch({ type: LOGOUT });
      navigation.replace('Get Started');
    } catch (e) {
      console.log(e);
      console.log('Log out cancelled');
    }
  }, [dispatch]);

  const navigateNewPet = useCallback(() => {
    navigation.navigate('Pet Creation');
  }, []);

  return (
    <SafeAreaView className='flex-1 h-full items-center bg-themeBg'>
      <Portal>
        <Modalize
          ref={accountSwitcherModalRef}
          handlePosition='inside'
          handleStyle={{ backgroundColor: themeConfig.customColors.themeText }}
          adjustToContentHeight
          scrollViewProps={{ scrollEnabled: false }}
          useNativeDriver>
          <AccountSwitcherModal
            navigateNewPet={navigateNewPet}
            currentUser={owner as OwnerDAO}
            closeModal={() => {
              accountSwitcherModalRef.current?.close();
            }}
          />
        </Modalize>
      </Portal>
      <Modal
        visible={modals.settings}
        presentationStyle='pageSheet'
        animationType='slide'
        onRequestClose={() => {
          setSettingsModalVisible(false);
        }}>
        <SettingsModal
          logout={logout}
          closeModal={() => {
            setSettingsModalVisible(false);
          }}
        />
      </Modal>
      <View className='flex-row items-center justify-between w-full px-5'>
        <Pressable onPress={() => accountSwitcherModalRef.current?.open()}>
          <View className='flex-row items-center gap-x-2'>
            <FontAwesome name='lock' style={{ marginBottom: 5 }} size={25} color={themeConfig.customColors.themeText} />
            <Text className='font-bold text-3xl'>{owner?.username}</Text>
            <Ionicon name='chevron-down' size={15} />
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            setSettingsModalVisible(true);
          }}>
          <Ionicon name='menu-outline' size={30} />
        </Pressable>
      </View>
      {owner && <OwnerProfile owner={owner} navigation={navigation as any} />}
    </SafeAreaView>
  );
};

export default MyProfile;
