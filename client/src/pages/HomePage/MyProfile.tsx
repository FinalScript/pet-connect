import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Image, LogBox, Modal, Pressable, SafeAreaView, ScrollView, Share, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import colors from '../../../config/tailwind/colors';
import { getApiBaseUrl } from '../../api';
import PetCard from '../../components/PetCard';
import Text from '../../components/Text';
import AccountSwitcherModal from '../../components/modals/AccountSwitcherModal';
import EditProfileModal from '../../components/modals/EditProfileModal';
import SettingsModal from '../../components/modals/SettingsModal';
import { LOGOUT } from '../../redux/constants';
import { OwnerDAO, ProfileReducer } from '../../redux/reducers/profileReducer';
import { FontAwesome, Ionicon } from '../../utils/Icons';

LogBox.ignoreLogs(["Modal with 'pageSheet' presentation style and 'transparent' value is not supported."]); // Ignore log notification by message

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
}

const MyProfile = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const { clearSession } = useAuth0();
  const [modals, setModals] = useState({ accountSwitcher: false, settings: false, editProfile: false });
  const accountSwitcherModalRef = useRef<Modalize>(null);

  const [selectedPetId, setSelectedPetId] = useState<string>();

  const setEditProfileModalVisible = useCallback((bool: boolean) => {
    setModals((prev) => {
      return { ...prev, editProfile: bool };
    });
  }, []);

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

  const onShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: 'Pet Connect - FinalScript',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  const renderOwnerPets = useMemo(() => {
    return (
      <View className='mt-10 flex-col justify-center'>
        {pets.map((pet) => {
          return (
            <PetCard
              key={pet.id}
              pet={pet}
              goToProfile={() => {
                navigation.navigate('Pet Profile', { petId: pet.id });
              }}
              isSelected={selectedPetId === pet.id}
              setIsSelected={setSelectedPetId}
            />
          );
        })}
      </View>
    );
  }, [pets, selectedPetId, setSelectedPetId]);

  const ownerProfile = useMemo(() => {
    return (
      <ScrollView className='w-full px-5'>
        <View className='mt-5 flex flex-row items-center justify-between'>
          <View className='relative'>
            <Pressable
              onPress={() => {
                if (owner) {
                  navigation.navigate('Profile Picture', { id: owner?.id, pet: false });
                }
              }}>
              <View className='w-28 h-28 rounded-full border-2 border-themeActive flex items-center justify-center'>
                {owner?.ProfilePicture?.url ? (
                  <Image
                    className='w-full h-full rounded-full'
                    source={{
                      uri: owner.ProfilePicture.url,
                    }}
                  />
                ) : (
                  <Ionicon name='person' size={55} />
                )}
              </View>
            </Pressable>
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
          <Text className='text-xl font-bold'>{owner?.name}</Text>
          {owner?.location && <Text className='text-md'>📍 {owner?.location}</Text>}
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
              onShare();
            }}>
            <View className='bg-themeBtn px-7 py-2 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>Share Profile</Text>
            </View>
          </PressableOpacity>
        </View>
        <View>{renderOwnerPets}</View>
      </ScrollView>
    );
  }, [owner, pets, setEditProfileModalVisible, getApiBaseUrl, renderOwnerPets]);

  return (
    <SafeAreaView className='flex-1 h-full items-center bg-themeBg'>
      {owner && (
        <Modal
          visible={modals.editProfile}
          presentationStyle='pageSheet'
          animationType='slide'
          onRequestClose={() => {
            setEditProfileModalVisible(false);
          }}>
          <EditProfileModal
            profile={owner as OwnerDAO}
            forPet={false}
            closeModal={() => {
              setEditProfileModalVisible(false);
            }}
          />
        </Modal>
      )}
      <Portal>
        <Modalize
          ref={accountSwitcherModalRef}
          handlePosition='inside'
          handleStyle={{ backgroundColor: colors.themeText }}
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
            <FontAwesome name='lock' style={{ marginBottom: 5 }} size={25} color={colors.themeText} />
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
      {ownerProfile}
    </SafeAreaView>
  );
};

export default MyProfile;
