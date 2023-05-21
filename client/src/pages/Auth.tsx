import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useAuth0} from 'react-native-auth0';

export default function Auth({navigation}: any) {
  const {authorize, clearSession, user} = useAuth0();

  const onLogin = async () => {
    authorize({scope: 'openid profile email'})
      .then(() => {
        navigation.navigate('Profile');
      })
      .catch(err => console.log(err));
  };

  const onLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  const loggedIn = user !== undefined && user !== null;

  return (
    <View style={styles.container}>
      {loggedIn && <Text>You are logged in as {user.name}</Text>}
      {!loggedIn && <Text>You are not logged in</Text>}

      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
