import React, { useEffect, useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { getOwnerData, setBearerToken } from '../api';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function Auth() {
  const navigation = useNavigation<NavigationProp>();
  const { authorize, clearSession, user, getCredentials } = useAuth0();

  useEffect(() => {
    getAuth();
  }, [user]);

  const getAuth = useCallback(() => {
    getCredentials('openid profile email').then(async (auth) => {
      if (auth && auth.accessToken) {
        setBearerToken(`Bearer ${auth.accessToken}`);
        getOwnerData()
          .then((res) => {
            navigation.replace('Home');
          })
          .catch((err) => {
            console.log(err);
            if (err.response && err.response.status === 404) {
              navigation.replace('Account Creation');
            }
          });
      } else {
        login();
      }
    });
  }, [navigation]);

  const login = async () => {
    authorize({ scope: 'openid profile email', audience: 'https://pet-app.com/api/v2' });
  };

  const logout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  const loggedIn = user !== undefined && user !== null;

  return (
    <View className='bg-[#fde1da] h-screen flex-1 justify-center items-center'>
      {loggedIn && <Text>{JSON.stringify(user, null, 2)}</Text>}
      {!loggedIn && <Text>You are not logged in</Text>}

      <Button onPress={loggedIn ? logout : login} title={loggedIn ? 'Log Out' : 'Log In'} />
    </View>
  );
}
