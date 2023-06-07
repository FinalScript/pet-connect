import React from 'react';
import { View, Button, SafeAreaView, ScrollView, Image } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useSelector } from 'react-redux';
import { ProfileReducer } from '../redux/reducers/profileReducer';
import Text from '../components/Text';
import { btoa } from '../utils/btoa';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const currentUser = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const navigation = useNavigation<NavigationProp>();
  const { clearSession } = useAuth0();

  const logout = async () => {
    try {
      await clearSession();

      navigation.navigate('AuthLoader');
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  return (
    <SafeAreaView className='flex-1 h-full items-center bg-[#fde1da]'>
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
              const { profilePicture, OwnerPets, ...display } = pet;
              return (
                <View key={i} className='bg-themeBtn rounded-3xl p-5 flex flex-col items-center'>
                  {pet.profilePicture && (
                    <View className='h-44 w-44'>
                      <Image className='w-full h-full' source={{ uri: `data:image/*;base64,${pet.profilePicture.data}` }} />
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
}
