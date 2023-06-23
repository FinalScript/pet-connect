import { Easing, Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { OwnerDAO, PetDAO, ProfileReducer } from '../../redux/reducers/profileReducer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AccountSwitcherModal from '../../components/AccountSwitcherModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Buffer } from 'buffer';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { LOGOUT } from '../../redux/constants';
import { Modalize } from 'react-native-modalize';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import SettingsModal from '../../components/SettingsModal';
import Text from '../../components/Text';
import { useAuth0 } from 'react-native-auth0';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { Portal } from 'react-native-portalize';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const window = Dimensions.get('screen');

const Profile = () => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const currentUserId = useSelector((state: ProfileReducer) => state.profile.currentUser?.id);
  const [currentUser, setCurrentUser] = useState<OwnerDAO | PetDAO>();
  const navigation = useNavigation<NavigationProp>();
  const { clearSession } = useAuth0();

  const accountSwitchModalRef = useRef<Modalize>(null);
  const settingsModalRef = useRef<Modalize>(null);

  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (owner?.id === currentUserId) {
      setCurrentUser(owner);
      return;
    }

    const pet = pets.find((pet) => pet.id === currentUserId);

    if (pet) {
      setCurrentUser(pet);
    }
  }, [currentUserId]);

  const setAccountSwitchModalVisible = (bool: boolean) => {
    bool ? accountSwitchModalRef.current?.open() : accountSwitchModalRef.current?.close();
  };

  const setSettingsModalVisible = (bool: boolean) => {
    bool ? settingsModalRef.current?.open() : settingsModalRef.current?.close();
  };

  const logout = useCallback(async () => {
    try {
      clearSession({}, { skipLegacyListener: true })
        .then((success) => {
          console.log(success);
        })
        .catch((error) => {
          console.log('Log out cancelled', error);
        });
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
          useNativeDriver
          ref={accountSwitchModalRef}
          handlePosition='inside'
          modalHeight={window.height * 0.75}
          modalStyle={{ backgroundColor: '#fde1da' }}
          scrollViewProps={{ contentContainerStyle: { height: '100%' } }}>
          <AccountSwitcherModal
            navigateNewPet={navigateNewPet}
            currentUser={currentUser}
            closeModal={() => {
              setAccountSwitchModalVisible(false);
            }}
          />
        </Modalize>
        <Modalize
          useNativeDriver
          ref={settingsModalRef}
          handlePosition='inside'
          modalHeight={window.height * 0.85}
          modalStyle={{ backgroundColor: '#fde1da' }}
          scrollViewProps={{ contentContainerStyle: { height: '100%' } }}>
          <SettingsModal
            logout={logout}
            closeModal={() => {
              setSettingsModalVisible(false);
            }}
          />
        </Modalize>
      </Portal>
      <View className='flex-row items-center justify-between w-full px-5'>
        <Pressable onPress={() => setAccountSwitchModalVisible(true)}>
          <View className='flex-row items-center gap-2'>
            <Ionicon name='lock-closed-outline' size={15} />
            <Text className='font-bold text-3xl'>{currentUser?.username}</Text>
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
      <ScrollView className='w-full px-5'>
        <View className='mt-5 flex flex-row items-center justify-between'>
          <View className='relative'>
            <View className='w-24 h-24 rounded-full border-2 border-themeActive flex items-center justify-center'>
              {currentUser?.ProfilePicture ? (
                <Image
                  className='w-full h-full rounded-full'
                  source={{
                    uri: `data:image/*;base64,${Buffer.from(currentUser.ProfilePicture.data).toString('base64')}`,
                  }}
                />
              ) : (
                <Ionicon name='person' size={55} />
              )}
            </View>
            <View className='border-2 border-themeBg bg-themeBg absolute rounded-full bottom-1 right-1'>
              <AntDesign name='pluscircle' size={20} color={'blue'} />
            </View>
          </View>
          <View className='px-5 flex flex-row gap-7'>
            <View className='flex items-center'>
              <Text className='text-xl font-bold'>5</Text>
              <Text className='text-md'>Posts</Text>
            </View>
            <View className='flex items-center'>
              <Text className='text-xl font-bold'>20</Text>
              <Text className='text-md'>Followers</Text>
            </View>
            <View className='flex items-center'>
              <Text className='text-xl font-bold'>25</Text>
              <Text className='text-md'>Following</Text>
            </View>
          </View>
        </View>
        <View className='mt-2'>
          <Text className='text-lg font-bold'>{currentUser?.name}</Text>
          <Text className='text-md'>{currentUser?.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
