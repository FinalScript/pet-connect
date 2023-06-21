import { View, SafeAreaView, ScrollView, Button, Image, Modal, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OwnerDAO, PetDAO, ProfileReducer } from '../../redux/reducers/profileReducer';
import { useNavigation } from '@react-navigation/native';
import { useAuth0 } from 'react-native-auth0';
import { CURRENT_USER, LOGOUT } from '../../redux/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Buffer } from 'buffer';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Text from '../../components/Text';
import PetTypeImage from '../../components/PetTypeImage';
import AccountSwitcherModal from '../../components/AccountSwitcherModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Profile = () => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const currentUserId = useSelector((state: ProfileReducer) => state.profile.currentUser?.id);
  const [currentUser, setCurrentUser] = useState<OwnerDAO | PetDAO>();
  const navigation = useNavigation<NavigationProp>();
  const { clearSession } = useAuth0();
  const [modalVisible, setModalVisible] = useState(false);

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

  const logout = async () => {
    try {
      await clearSession();
      dispatch({ type: LOGOUT });
      navigation.replace('Get Started');
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  return (
    <SafeAreaView className='flex-1 h-full items-center bg-themeBg'>
      <AccountSwitcherModal currentUser={currentUser} modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <ScrollView className='w-full px-5'>
        <Pressable onPress={() => setModalVisible(true)}>
          <View className='flex flex-row items-center gap-2'>
            <Ionicon name='lock-closed-outline' size={15} />
            <Text className='font-bold text-3xl'>{currentUser?.username}</Text>
            <Ionicon name='chevron-down' size={15} />
          </View>
        </Pressable>
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

      <View className='flex flex-row gap-x-5'>
        <Button
          onPress={() => {
            navigation.push('Pet Creation');
          }}
          title={'Add Pet'}
        />
        <Button onPress={logout} title={'Log Out'} />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
