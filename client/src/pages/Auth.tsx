import axios from 'axios';
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

export default function Auth() {
  const { authorize, clearSession, user, getCredentials } = useAuth0();

  useEffect(() => {
    getCredentials('openid profile email').then((res) => {
      if (res && res.accessToken) {
        axios
          .get('http://10.0.2.2:3000/api/private', { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${res.accessToken}` } })
          .then((res) => {
            console.log(res.status, res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }, [user]);

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
    <View className='flex-1 justify-center items-center bg-[#F5FCFF]'>
      {loggedIn && <Text>{JSON.stringify(user, null, 2)}</Text>}
      {!loggedIn && <Text>You are not logged in</Text>}

      <Button onPress={loggedIn ? logout : login} title={loggedIn ? 'Log Out' : 'Log In'} />
    </View>
  );
}
