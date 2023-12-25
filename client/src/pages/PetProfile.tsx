import { useMutation, useQuery } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, Tab, TabBarProps, TabView } from '@ui-kitten/components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Modal, Pressable, SafeAreaView, ScrollView, Share, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../App';
import { Post } from '../__generated__/graphql';
import Image from '../components/Image';
import PetTypeImage from '../components/PetTypeImage';
import Text from '../components/Text';
import EditProfileModal from '../components/modals/EditProfileModal';
import { FOLLOW_PET, GET_PET_BY_ID, GET_PET_FOLLOWER_COUNT, IS_FOLLOWING_PET, UNFOLOW_PET } from '../graphql/Pet';
import { GET_POSTS_BY_PET_ID } from '../graphql/Post';
import { POST_DATA } from '../redux/constants';
import { PetDAO, ProfileReducer } from '../redux/reducers/profileReducer';
import { Feather } from '../utils/Icons';
import { themeConfig } from '../utils/theme';

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
  const dispatch = useDispatch();
  const ownerId = useSelector((state: ProfileReducer) => state.profile.owner?.id);
  const { data: petData } = useQuery(GET_PET_BY_ID, { variables: { id: petId }, pollInterval: 10000 });
  const { data: postsData } = useQuery(GET_POSTS_BY_PET_ID, { variables: { petId }, pollInterval: 10000 });
  const { data: isFollowingData, refetch: refetchIsFollowingData } = useQuery(IS_FOLLOWING_PET, {
    variables: { ownerId: ownerId || '', petId },
    skip: !ownerId,
  });
  const { data: petFollowersData, refetch: refetchFollowerCount } = useQuery(GET_PET_FOLLOWER_COUNT, { variables: { id: petId }, pollInterval: 10000 });

  const pet = useMemo(() => petData?.getPetById.pet, [petData, petId]);
  const gridPosts: Post[] = useMemo(() => postsData?.getPetById.pet.Posts || [], [postsData]);
  const isOwner = useMemo(() => ownerId === pet?.Owner?.id, [ownerId, pet?.Owner?.id]);
  const followersCount = useMemo(() => petFollowersData?.getPetById.pet.followerCount || 0, [petFollowersData]);
  const isFollowing = useMemo(() => isFollowingData?.isFollowingPet, [isFollowingData]);

  useEffect(() => {
    dispatch({ type: POST_DATA, payload: gridPosts });
  }, [gridPosts]);

  const [followPet] = useMutation(FOLLOW_PET);
  const [unfollowPet] = useMutation(UNFOLOW_PET);

  const tabBarState = useTabBarState();
  const [modals, setModals] = useState({ accountSwitcher: false, settings: false, editProfile: false });

  useEffect(() => {
    console.log(petId);
  }, [petId]);

  useEffect(() => {
    navigation.setOptions({ title: pet?.username });
  }, [pet]);

  const setEditProfileModalVisible = useCallback((bool: boolean) => {
    setModals((prev) => {
      return { ...prev, editProfile: bool };
    });
  }, []);

  const handleFollow = useCallback(async () => {
    if (!pet) return;

    await followPet({ variables: { id: pet.id } });
    await refetchIsFollowingData();
    await refetchFollowerCount();
  }, [followPet, pet]);

  const handleUnfollow = useCallback(async () => {
    if (!pet) return;

    await unfollowPet({ variables: { id: pet.id } });
    await refetchIsFollowingData();
    await refetchFollowerCount();
  }, [unfollowPet, pet]);

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
              <Pressable
                onPress={() => {
                  if (pet) navigation.push('Profile Feed', { petUsername: pet.username, initialPostIndex: index, posts: gridPosts });
                }}>
                <Image className='w-full h-auto aspect-square' source={{ uri: post.Media.url }} resizeMode='cover' />
              </Pressable>
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

      <ScrollView className='w-full px-5'>
        <View className='mt-2.5 flex flex-row items-center justify-center'>
          <Pressable
            className='flex-1'
            onPress={() => {
              navigation.push('Followers', { petId: pet.id });
            }}>
            <View className='flex items-center'>
              <Text className='text-xl font-bold'>{followersCount}</Text>
              <Text className='text-md'>Followers</Text>
            </View>
          </Pressable>

          <Pressable
            className='mx-5'
            onPress={() => {
              if (pet.ProfilePicture) {
                navigation.push('Profile Picture', { profilePicture: pet?.ProfilePicture });
              }
            }}>
            <View className='w-36 h-36 flex items-center justify-center'>
              {pet?.ProfilePicture?.url ? (
                <Image
                  className='w-full h-full rounded-3xl border-2 border-themeActive'
                  source={{
                    uri: pet.ProfilePicture.url,
                  }}
                />
              ) : (
                pet?.type && <PetTypeImage type={pet?.type} className='w-10 h-10' />
              )}
            </View>
          </Pressable>

          <View className='flex items-center flex-1'>
            <Text className='text-xl font-bold'>{pet.totalLikes}</Text>
            <Text className='text-md'>Likes</Text>
          </View>
        </View>

        <View className='mt-3 flex items-center'>
          <Text className='text-xl font-bold'>{pet?.name}</Text>

          {pet.description && <Text className='text-md'>{pet.description}</Text>}
          {pet?.type && (
            <View className='flex-row items-center mt-4 bg-themeShadow px-3 rounded-xl'>
              <Text className='text-sm mr-2'>{pet.type.charAt(0) + pet.type.substring(1).toLowerCase()}</Text>
              <PetTypeImage type={pet.type} className='w-4 h-4' />
            </View>
          )}
        </View>

        <View className='mt-5 flex-row gap-x-3'>
          <Pressable
            className='flex-1'
            onPress={() => {
              if (isOwner) {
                setEditProfileModalVisible(true);
                return;
              }

              if (isFollowing) {
                handleUnfollow();
              } else {
                handleFollow();
              }
            }}>
            <View className='bg-themeBtn px-7 py-2 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>{isOwner ? 'Edit Profile' : isFollowing ? 'Unfollow' : 'Follow'}</Text>
            </View>
          </Pressable>
          <Pressable
            className='flex-1'
            onPress={() => {
              pet.Owner?.id && navigation.push('Owner Profile', { ownerId: pet.Owner.id });
            }}>
            <View className='bg-themeBtn px-7 py-2 rounded-lg'>
              <Text className='text-themeText text-base font-semibold text-center'>Visit Owner</Text>
            </View>
          </Pressable>
        </View>
        <View className='w-full -mx-5 mt-5 h-full'>
          <TabView
            {...tabBarState}
            animationDuration={150}
            style={{ width: Dimensions.get('window').width, flex: 1 }}
            tabBarStyle={{ backgroundColor: 'transparent', paddingBottom: 10 }}
            indicatorStyle={{ backgroundColor: themeConfig.customColors.themeTrim }}>
            <Tab icon={() => <Feather name='grid' size={18} color={themeConfig.customColors.themeText} />}>
              <Layout style={{ flex: 1, backgroundColor: themeConfig.customColors.themeBg }}>{renderPostsGrid()}</Layout>
            </Tab>
            <Tab icon={() => <Feather name='heart' size={18} color={themeConfig.customColors.themeText} />}>
              <Layout style={{ flex: 1, backgroundColor: themeConfig.customColors.themeBg }}>
                <View className='flex items-center'>
                  <Text className='mt-5'>Nothing to see here...</Text>
                </View>
              </Layout>
            </Tab>
          </TabView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetProfile;
