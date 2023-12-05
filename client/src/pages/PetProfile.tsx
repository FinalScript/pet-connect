import { useLazyQuery } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon, IconElement, IconProps, Layout, Tab, TabBarProps, TabView } from '@ui-kitten/components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Modal, Pressable, SafeAreaView, ScrollView, Share, View } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../App';
import Image from '../components/Image';
import PetTypeImage from '../components/PetTypeImage';
import Text from '../components/Text';
import EditProfileModal from '../components/modals/EditProfileModal';
import { GET_PET_BY_ID } from '../graphql/Pet';
import { GET_POSTS_BY_PET_ID } from '../graphql/Post';
import { PetDAO, ProfileReducer } from '../redux/reducers/profileReducer';
import colors from '../../config/tailwind/colors';
import { Feather } from '../utils/Icons';

const useTabBarState = (initialState = 0): Partial<TabBarProps> => {
  const [selectedIndex, setSelectedIndex] = useState(initialState);
  return { selectedIndex, onSelect: setSelectedIndex };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Pet Profile'>;

const PetProfile = ({
  navigation,
  route: {
    params: { petId },
  },
}: Props) => {
  const ownerId = useSelector((state: ProfileReducer) => state.profile.owner?.id);
  const [getPet, { data: petData }] = useLazyQuery(GET_PET_BY_ID, { fetchPolicy: 'network-only' });
  const [getPostsByPetId, { data: postsData }] = useLazyQuery(GET_POSTS_BY_PET_ID, { fetchPolicy: 'network-only' });
  const pet = useMemo(() => petData?.getPetById.pet, [petData, petId]);
  const isOwner = useMemo(() => ownerId === pet?.Owner?.id, [ownerId, pet?.Owner?.id]);
  const [modals, setModals] = useState({ accountSwitcher: false, settings: false, editProfile: false });
  const gridPosts = useMemo(() => {
    return postsData?.getPostsByPetId?.posts || [];
  }, [postsData]);
  const tabBarState = useTabBarState();

  useEffect(() => {
    getPet({ variables: { id: petId } });
    getPostsByPetId({ variables: { petId } });
  }, [petId, getPet, getPostsByPetId]);

  useEffect(() => {
    navigation.setOptions({ title: pet?.username });
  }, [pet]);

  const setEditProfileModalVisible = useCallback((bool: boolean) => {
    setModals((prev) => {
      return { ...prev, editProfile: bool };
    });
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

  const renderPostsGrid = useCallback(() => {
    if (gridPosts.length === 0) {
      return (
        <View className='h-full flex-1 items-center justify-center mt-10'>
          <Text className='text-lg text-center text-slate-500 px-4'>This user hasn't posted yet</Text>
        </View>
      );
    }
    return (
      <View className='flex-row flex-wrap justify-start -mx-[1px]'>
        {gridPosts.map((post, index) => {
          return (
            <View key={index} className='w-1/3 p-[1px]'>
              <Image className='w-full h-auto aspect-square' source={{ uri: post.Media.url }} resizeMode='cover' />
            </View>
          );
        })}
      </View>
    );
  }, [gridPosts]);

  if (!pet || !pet.Owner) {
    return <View></View>;
  }

  return (
    <SafeAreaView className='bg-themeBg h-full p-5 flex flex-col flew-grow'>
      {isOwner && (
        <Modal
          visible={modals.editProfile}
          presentationStyle='pageSheet'
          animationType='slide'
          onRequestClose={() => {
            setEditProfileModalVisible(false);
          }}>
          <EditProfileModal
            profile={pet as PetDAO}
            forPet={true}
            closeModal={() => {
              setEditProfileModalVisible(false);
            }}
          />
        </Modal>
      )}

      <ScrollView className='w-full px-5 mb-12'>
        <View className='mt-5 flex flex-row items-center justify-between'>
          <View className='relative'>
            <Pressable
              onPress={() => {
                if (pet) {
                  navigation.navigate('Profile Picture', { id: pet?.id, isPet: true });
                }
              }}>
              <View className='w-28 h-28 rounded-full border-2 border-themeActive flex items-center justify-center'>
                {pet?.ProfilePicture?.url ? (
                  <Image
                    className='w-full h-full rounded-full'
                    source={{
                      uri: pet.ProfilePicture.url,
                    }}
                  />
                ) : (
                  pet?.type && <PetTypeImage type={pet?.type} className='w-10 h-10' />
                )}
              </View>
            </Pressable>
          </View>
          <View className='px-5 flex items-start'>
            <View className='flex flex-row gap-7'>
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
            {pet?.type && (
              <View className='flex-row items-center mt-4 bg-themeShadow px-3 rounded-xl'>
                <Text className='text-sm mr-2'>{pet.type.charAt(0) + pet.type.substring(1).toLowerCase()}</Text>
                <PetTypeImage type={pet.type} className='w-4 h-4' />
              </View>
            )}
          </View>
        </View>
        <View className='mt-3'>
          <Text className='text-xl font-bold'>{pet?.name}</Text>

          <View className='flex-row gap-x-1'>
            <Text>Owned by</Text>
            <Pressable
              onPress={() => {
                pet.Owner?.id && navigation.navigate('Owner Profile', { ownerId: pet.Owner.id });
              }}>
              <Text className='font-medium text-blue-500'>@{pet.Owner.username}</Text>
            </Pressable>
          </View>

          {pet.description && <Text className='text-md'>{pet.description}</Text>}
        </View>
        <View className='mt-5 flex-row gap-x-3'>
          <PressableOpacity
            className='flex-1'
            activeOpacity={0.6}
            onPress={() => {
              isOwner && setEditProfileModalVisible(true);
            }}>
            <View className='bg-themeBtn px-7 py-2 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>{isOwner ? 'Edit Profile' : 'Follow'}</Text>
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

        <View className='w-full -mx-5 mt-7 h-full'>
          <TabView
            {...tabBarState}
            animationDuration={150}
            style={{ width: Dimensions.get('window').width, flex: 1 }}
            tabBarStyle={{ backgroundColor: 'transparent', paddingBottom: 10 }}
            indicatorStyle={{ backgroundColor: colors.themeActive }}>
            <Tab icon={() => <Feather name='grid' size={18} color={colors.themeText} />}>
              <Layout style={{ flex: 1, backgroundColor: colors.themeBg }}>{renderPostsGrid()}</Layout>
            </Tab>
            <Tab icon={() => <Feather name='heart' size={18} color={colors.themeText} />}>
              <Layout style={{ flex: 1, backgroundColor: colors.themeBg }}>{renderPostsGrid()}</Layout>
            </Tab>
          </TabView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetProfile;
