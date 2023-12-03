import { useLazyQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, LogBox, Modal, Pressable, SafeAreaView, ScrollView, Share, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { PressableOpacity } from 'react-native-pressable-opacity';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import colors from '../../../config/tailwind/colors';
import { getApiBaseUrl } from '../../api';
import Image from '../../components/Image';
import PetTypeImage from '../../components/PetTypeImage';
import Text from '../../components/Text';
import AccountSwitcherModal from '../../components/modals/AccountSwitcherModal';
import EditProfileModal from '../../components/modals/EditProfileModal';
import SettingsModal from '../../components/modals/SettingsModal';
import { GET_POSTS_BY_PET_ID } from '../../graphql/Post';
import { LOGOUT } from '../../redux/constants';
import { OwnerDAO, PetDAO, ProfileReducer } from '../../redux/reducers/profileReducer';
import { FontAwesome, Ionicon } from '../../utils/Icons';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

LogBox.ignoreLogs(["Modal with 'pageSheet' presentation style and 'transparent' value is not supported."]); // Ignore log notification by message

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
}

const Profile = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const currentUserId = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const [currentUser, setCurrentUser] = useState<OwnerDAO | PetDAO>();
  const { clearSession } = useAuth0();
  const [modals, setModals] = useState({ accountSwitcher: false, settings: false, editProfile: false });
  const accountSwitcherModalRef = useRef<Modalize>(null);
  const Tab = createMaterialTopTabNavigator();

  const [getPostsByPetId, { data: postsData }] = useLazyQuery(GET_POSTS_BY_PET_ID, {
    fetchPolicy: 'network-only',
  });

  const gridPosts = useMemo(() => {
    return postsData?.getPostsByPetId?.posts || [];
  }, [postsData, pets]);

  useEffect(() => {
    if (owner?.id === currentUserId?.id) {
      setCurrentUser(owner);
      return;
    }

    const pet = pets.find((pet) => pet.id === currentUserId?.id);

    if (pet) {
      setCurrentUser(pet);
      getPostsByPetId({ variables: { petId: pet.id } });
    }
  }, [currentUserId, owner, pets]);

  const setEditProfileModalVisible = useCallback((bool: boolean) => {
    setModals((prev) => {
      return { ...prev, editProfile: bool };
    });
  }, []);

  const setAccountSwitchModalVisible = useCallback((bool: boolean) => {
    setModals((prev) => {
      return { ...prev, accountSwitcher: bool };
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

  const renderPostsGrid = () => {
    console.log('Rendering grid with posts:', gridPosts);
    if (gridPosts.length === 0) {
      return (
        <View className='flex-1 items-center justify-center mt-10'>
          <Text className='text-lg text-center text-gray-500 px-4'>No posts available</Text>
        </View>
      );
    }
    return (
      <View className='flex-row flex-wrap justify-start mt-5 -mx-1'>
        {gridPosts.map((post, index) => {
          return (
            <View key={index} className='w-1/3 p-0.5'>
              <Image className='w-full h-auto aspect-square' source={{ uri: post.Media.url }} resizeMode='cover' />
            </View>
          );
        })}
      </View>
    );
  };

  const PostsTab = () => {
    return <View className='flex-1 w-full h-full'>{renderPostsGrid()}</View>;
  };

  const LikesTab = () => {
    return <View>{renderPostsGrid()}</View>;
  };

  const ownerProfile = useMemo(() => {
    return (
      <ScrollView className='w-full px-5'>
        <View className='mt-5 flex flex-row items-center justify-between'>
          <View className='relative'>
            <Pressable onPress={() => {}}>
              <View className='w-28 h-28 rounded-full border-2 border-themeActive flex items-center justify-center'>
                {currentUser?.ProfilePicture?.url ? (
                  <Image
                    className='w-full h-full rounded-full'
                    source={{
                      uri: currentUser.ProfilePicture.url,
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
          {currentUser?.location && <Text className='text-md'>📍 {currentUser?.location}</Text>}
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

        <View className='mt-10 flex-row flex-wrap justify-center gap-x-5'>
          {pets.map((pet) => {
            return (
              <View key={pet.id} className='bg-themeTabBg rounded-3xl w-5/12'>
                <View className='aspect-square w-full flex justify-center items-center'>
                  {pet?.ProfilePicture?.url ? (
                    <Image
                      className='w-full h-full rounded-t-2xl'
                      source={{
                        uri: pet.ProfilePicture.url,
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
      <ScrollView className='w-full '>
        <View className='mt-5 flex items-center justify-between'>
          <View className='relative'>
            <Pressable onPress={() => {}}>
              <View className='w-44 h-44 rounded-full border-2 border-themeActive flex items-center justify-center'>
                {currentUser?.ProfilePicture?.url ? (
                  <Image
                    className='w-full h-full rounded-full'
                    source={{
                      uri: currentUser.ProfilePicture.url,
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
          <Text className='text-lg'>@{currentUser?.username}</Text>
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
        <View className='mt-2 px-5'>
          <Text className='text-base'>{(currentUser as PetDAO)?.description}</Text>
        </View>
        <View className='mt-5 flex-row gap-x-3 px-5'>
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
        <View>
          <ScrollView>
            <Tab.Navigator
              initialRouteName='Posts'
              screenOptions={{
                tabBarPressOpacity: 100,
                tabBarPressColor: 'rgba(0,0,0,0)',
                tabBarActiveTintColor: colors.themeText,
                tabBarContentContainerStyle: {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                tabBarIndicatorStyle: { display: 'none' },
                tabBarItemStyle: { width: 100, paddingHorizontal: 0, position: 'relative', padding: 0, height: 45 },
                tabBarLabelStyle: {
                  fontSize: 18,
                  fontFamily: 'BalooChettan2-Regular',
                },
                tabBarStyle: {
                  width: 'auto',
                  height: 'auto',
                  backgroundColor: 'transparent',
                },
              }}>
              <Tab.Screen
                name='Posts'
                children={() => {
                  return (
                    <View className='flex-1 h-full bg-themeBg'>
                      <Animated.ScrollView
                        scrollEventThrottle={16}
                        className='w-full pt-10'/>
                        <View className='flex justify-center items-center h-full pb-5 px-3'>
                          <>
                            <View className='flex-1 w-full h-full'>{renderPostsGrid()}</View>
                          </>
                        </View>                      
                    </View>
                  );
                }}
              />
              <Tab.Screen name='Likes' component={LikesTab} />
            </Tab.Navigator>
          </ScrollView>
        </View>
      </ScrollView>
    );
  }, [currentUser, setEditProfileModalVisible, getApiBaseUrl, gridPosts]);

  return (
    <SafeAreaView className='flex-1 h-full items-center bg-themeBg'>
      {currentUser && (
        <Modal
          visible={modals.editProfile}
          presentationStyle='pageSheet'
          animationType='slide'
          onRequestClose={() => {
            setEditProfileModalVisible(false);
          }}>
          <EditProfileModal
            profile={currentUser}
            forPet={currentUserId.isPet}
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
            currentUser={currentUser}
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
