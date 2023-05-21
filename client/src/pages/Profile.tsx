import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useAuth0} from 'react-native-auth0';

export default function Profile() {
  const {getCredentials, user} = useAuth0();

  useEffect(() => {
    getCredentials('openid profile email').then(res => {
      console.log(res);
    });
  }, [user]);

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(user, null, 2)}</Text>
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
