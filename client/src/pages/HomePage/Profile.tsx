import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { OwnerDAO, PetDAO, ProfileReducer } from '../../redux/reducers/profileReducer';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Dimensions } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Portal } from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { RootStackParamList } from '../../../App';
import Text from '../../components/Text';
import AccountSwitcherModal from '../../components/modals/AccountSwitcherModal';
import SettingsModal from '../../components/modals/SettingsModal';
import { LOGOUT } from '../../redux/constants';

import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { getApiBaseUrl } from '../../api';
import PetTypeImage from '../../components/PetTypeImage';
import EditProfileModal from '../../components/modals/EditProfileModal';
import { Ionicon } from '../../utils/Icons';
import { options } from '../../utils/hapticFeedbackOptions';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Profile = () => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const currentUserId = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const [currentUser, setCurrentUser] = useState<OwnerDAO | PetDAO>();
  const navigation = useNavigation<NavigationProp>();
  const { clearSession } = useAuth0();
  const [modals, setModals] = useState({ accountSwitcher: false, settings: false, editProfile: false });

  useEffect(() => {
    if (owner?.id === currentUserId?.id) {
      setCurrentUser(owner);
      return;
    }

    const pet = pets.find((pet) => pet.id === currentUserId?.id);

    if (pet) {
      setCurrentUser(pet);
    }
  }, [currentUserId, owner, pets]);

  const setEditProfileModalVisible = useCallback((bool: boolean) => {
    trigger(HapticFeedbackTypes.contextClick, options);
    setModals((prev) => {
      return { ...prev, editProfile: bool };
    });
  }, []);

  const setAccountSwitchModalVisible = useCallback((bool: boolean) => {
    trigger(HapticFeedbackTypes.contextClick, options);
    setModals((prev) => {
      return { ...prev, accountSwitcher: bool };
    });
  }, []);

  const setSettingsModalVisible = useCallback((bool: boolean) => {
    trigger(HapticFeedbackTypes.contextClick, options);
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

  const ownerProfile = useMemo(() => {
    return (
      <ScrollView className='w-full px-5'>
        <View className='mt-5 flex flex-row items-center justify-between'>
          <View className='relative'>
            <Pressable onPress={() => {}}>
              <View className='w-28 h-28 rounded-full border-2 border-themeActive flex items-center justify-center'>
                {currentUser?.ProfilePicture?.path ? (
                  <Image
                    className='w-full h-full rounded-full'
                    source={{
                      uri: `${getApiBaseUrl()}/${currentUser.ProfilePicture.path}?${Date.now()}`,
                    }}
                  />
                ) : (
                  <Ionicon name='person' size={55} />
                )}
              </View>
            </Pressable>
            <View className='border-2 border-themeBg bg-themeBg absolute rounded-full bottom-1 right-1'>
              <AntDesign name='pluscircle' size={20} color={'blue'} />
            </View>
          </View>
          <View className='px-5 flex flex-row gap-7'>
            <View className='flex items-center'>
              <Text className='text-xl font-bold'>{pets.length}</Text>
              <Text className='text-md'>Pets</Text>
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
        <View className='mt-3'>
          <Text className='text-xl font-bold'>{currentUser?.name}</Text>
          <Text className='text-md'>{currentUser?.description}</Text>
        </View>
        <View className='mt-5 flex-row gap-x-3'>
          <PressableOpacity
            className='flex-1'
            activeOpacity={0.6}
            onPress={() => {
              setEditProfileModalVisible(true);
            }}>
            <View className='bg-themeBtn px-7 py-2 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>Edit Profile</Text>
            </View>
          </PressableOpacity>
          <PressableOpacity
            className='flex-1'
            activeOpacity={0.6}
            onPress={() => {
              // TODO
            }}>
            <View className='bg-themeBtn px-7 py-2 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>Share Profile</Text>
            </View>
          </PressableOpacity>
        </View>

        <View className='mt-10 flex-row flex-wrap justify-center gap-x-5'>
          {pets.map((pet) => {
            return (
              <View key={pet.id} className='bg-themeTabBg rounded-3xl w-5/12'>
                <View className='aspect-square w-full flex justify-center items-center'>
                  {pet?.ProfilePicture?.path ? (
                    <Image
                      className='w-full h-full rounded-t-2xl'
                      source={{
                        uri: getApiBaseUrl() + '/' + pet.ProfilePicture.path,
                      }}
                    />
                  ) : (
                    <PetTypeImage type={pet.type} className='w-full h-full' />
                  )}
                </View>
                <View className='px-3 pb-3'>
                  <Text className='mt-2.5 text-lg font-bold'>{pet.name}</Text>
                  <Text className='font-light text-slate-700'>@{pet.username}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }, [currentUser, pets, setEditProfileModalVisible, getApiBaseUrl]);

  const petProfile = useMemo(() => {
    return (
      <ScrollView className='w-full px-5'>
        <View className='mt-5 flex items-center justify-between'>
          <View className='relative'>
            <Pressable onPress={() => {}}>
              <View className='w-44 h-44 rounded-full border-2 border-themeActive flex items-center justify-center'>
                {currentUser?.ProfilePicture?.path ? (
                  <Image
                    className='w-full h-full rounded-full'
                    source={{
                      uri: `${getApiBaseUrl()}/${currentUser.ProfilePicture.path}?${Date.now()}`,
                    }}
                  />
                ) : (
                  <Ionicon name='person' size={55} />
                )}
              </View>
            </Pressable>
            <View className='border-2 border-themeBg bg-themeBg absolute rounded-full bottom-3 right-3'>
              <AntDesign name='pluscircle' size={20} color={'blue'} />
            </View>
          </View>
          <Text className='text-4xl font-semibold mt-5'>{currentUser?.name}</Text>
          <View className='px-5 flex flex-row gap-x-5 mt-2'>
            <View className='flex items-center'>
              <Text className='text-xl font-semibold'>5</Text>
              <Text className='text-md'>Posts</Text>
            </View>
            <View className='flex items-center'>
              <Text className='text-xl font-semibold'>20</Text>
              <Text className='text-md'>Followers</Text>
            </View>
          </View>
        </View>
        <View className='mt-2'>
          <Text className='text-base'>{currentUser?.description}</Text>
        </View>
        <View className='mt-5 flex-row gap-x-3'>
          <PressableOpacity
            className='flex-1'
            activeOpacity={0.6}
            onPress={() => {
              setEditProfileModalVisible(true);
            }}>
            <View className='bg-themeBtn px-7 py-1 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>Edit Profile</Text>
            </View>
          </PressableOpacity>
          <PressableOpacity
            className='flex-1'
            activeOpacity={0.6}
            onPress={() => {
              // TODO
            }}>
            <View className='bg-themeBtn px-7 py-1 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>Share Profile</Text>
            </View>
          </PressableOpacity>
        </View>
      </ScrollView>
    );
  }, [currentUser, setEditProfileModalVisible, getApiBaseUrl]);

  return (
    <SafeAreaView className='flex-1 h-full items-center bg-themeBg'>
      <Portal>
        <Modal
          visible={modals.editProfile}
          presentationStyle='pageSheet'
          animationType='slide'
          onRequestClose={() => {
            setEditProfileModalVisible(false);
          }}>
          <EditProfileModal
            profile={currentUser}
            closeModal={() => {
              setEditProfileModalVisible(false);
            }}
          />
        </Modal>
        <Modal
          style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
          visible={modals.accountSwitcher}
          presentationStyle='pageSheet'
          animationType='slide'
          onRequestClose={() => {
            setAccountSwitchModalVisible(false);
          }}>
          <AccountSwitcherModal
            navigateNewPet={navigateNewPet}
            currentUser={currentUser}
            closeModal={() => {
              setAccountSwitchModalVisible(false);
            }}
          />
        </Modal>
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
      {currentUserId?.isPet ? petProfile : ownerProfile}
    </SafeAreaView>
  );
};

export default Profile;
