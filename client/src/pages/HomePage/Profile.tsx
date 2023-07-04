import { View, Text, SafeAreaView, ScrollView, Button, Image } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import { useNavigation } from '@react-navigation/native';
import { useAuth0 } from 'react-native-auth0';
import { LOGOUT } from '../../redux/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Buffer } from 'buffer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Profile = () => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const currentUser = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const navigation = useNavigation<NavigationProp>();
  const { clearSession } = useAuth0();

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
      <ScrollView className='w-screen px-10'>
        <Text className='font-bold text-3xl'>Home Page</Text>

        <View className='mt-10'>
          <Text className='font-bold text-2xl'>Owner Information</Text>
          <Text>{JSON.stringify(owner, null, 2)}</Text>
        </View>

        <View className='mt-10'>
          <Text className='font-bold text-2xl'>Current User</Text>
          <Text>{JSON.stringify(currentUser, null, 2)}</Text>
        </View>

        <View className='mt-10'>
          <Text className='font-bold text-2xl'>Pets</Text>
          <View>
            {pets.map((pet, i) => {
              const { ProfilePicture, OwnerPets, ...display } = pet;
              return (
                <View key={i} className='bg-themeBtn rounded-3xl p-5 flex flex-col items-center mb-2'>
                  {pet.ProfilePicture && (
                    <View className='h-44 w-44'>
                      <Image className='w-full h-full' source={{ uri: `data:image/*;base64,${Buffer.from(pet.ProfilePicture.data).toString('base64')}` }} />
                    </View>
                  )}
                  <Text>{JSON.stringify(display, null, 2)}</Text>
                </View>
              );
            })}
          </View>
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
