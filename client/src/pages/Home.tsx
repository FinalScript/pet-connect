import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
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
    <View className='flex-1 justify-center items-center bg-[#fde1da]'>
      <Text>Home Page</Text>
      <Button onPress={logout} title={'Log Out'} />
    </View>
  );
}
