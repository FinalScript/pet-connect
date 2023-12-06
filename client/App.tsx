import { useLazyQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, RouteProp, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Host } from 'react-native-portalize';
import { useDispatch, useSelector } from 'react-redux';
import { VERIFY_TOKEN } from './src/graphql/Auth';
import { GET_OWNER } from './src/graphql/Owner';
import AppLoader from './src/hoc/AppLoader';
import AccountCreation from './src/pages/AccountCreation';
import GetStarted from './src/pages/GetStarted';
import HomeNavigator from './src/pages/HomePage/HomeNavigator';
import Loading from './src/pages/Loading';
import OwnerProfile from './src/pages/OwnerProfilePage/OwnerProfile';
import PetCreation from './src/pages/PetCreation';
import PetProfile from './src/pages/PetProfile';
import { CURRENT_USER, LOADING, OWNER_DATA, PET_DATA } from './src/redux/constants';
import { ProfileReducer } from './src/redux/reducers/profileReducer';
import { navigationRef } from './src/services/navigator';
import { options } from './src/utils/hapticFeedbackOptions';
import PostPage from './src/pages/HomePage/PostPage';
import ProfilePicturePage from './src/pages/ProfilePicture';
import ProfileFeed from './src/pages/ProfileFeed';
import { Owner, Pet, Post, ProfilePicture as ProfilePictureType } from './src/__generated__/graphql';
import OwnerProfilePage from './src/pages/OwnerProfilePage/OwnerProfilePage';
import FollowingPage from './src/pages/Following';
import FollowersPage from './src/pages/Followers';

export type RootStackParamList = {
  Loading: undefined;
  Home: undefined;
  'Get Started': undefined;
  'Pet Creation'?: {
    initial?: boolean;
  };
  'Account Creation': undefined;
  'Pet Profile': { petId: string };
  'Owner Profile': { ownerId: string };
  'New Post': undefined;
  'Profile Picture': { profilePicture?: ProfilePictureType | null };
  'Profile Feed': { petUsername: string; posts: Post[]; initialPostIndex: number };
  Following: { following?: Pet[] };
  Followers: { followers?: Owner[] };
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<RootStackParamList, RouteName>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const dispatch = useDispatch();
  const [getUserData] = useLazyQuery(GET_OWNER);
  const [verifyToken] = useLazyQuery(VERIFY_TOKEN);
  const { user, getCredentials } = useAuth0();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);

  useEffect(() => {
    getAuth();
  }, [user, navigationRef]);

  useEffect(() => {
    if (owner) {
      trigger(HapticFeedbackTypes.notificationSuccess, options);
      navigationRef.dispatch(StackActions.replace('Home'));
    }
  }, [owner?.id]);

  const getAuth = useCallback(async () => {
    if (!navigationRef.isReady()) {
      return;
    }

    let token;

    try {
      token = await AsyncStorage.getItem('@token');
    } catch (e) {
      console.error(e);
    }

    if (!token) {
      console.log('token not found');
      const credentials = await getCredentials('openid profile email');

      if (!credentials?.accessToken) {
        dispatch({ type: LOADING, payload: false });
        navigationRef.dispatch(StackActions.replace('Get Started'));
        return;
      }

      try {
        await AsyncStorage.setItem('@token', credentials.accessToken);
      } catch (error) {
        // Error saving data
      }

      fetchUserData();

      return;
    }

    console.log('token found');

    const verifiedToken = await verifyToken();

    if (verifiedToken.error) {
      console.log(verifiedToken.error);
      await AsyncStorage.removeItem('@token');
      dispatch({ type: LOADING, payload: false });
      navigationRef.dispatch(StackActions.replace('Get Started'));
      return;
    }

    await fetchUserData();
  }, [navigationRef, dispatch, verifyToken]);

  const fetchUserData = useCallback(async () => {
    const ownerData = await getUserData();

    if (ownerData.error && ownerData.error.message === 'Owner not found') {
      dispatch({ type: LOADING, payload: false });
      trigger(HapticFeedbackTypes.notificationWarning, options);
      navigationRef.dispatch(StackActions.replace('Account Creation'));
      return;
    }

    if (!ownerData) {
      dispatch({ type: LOADING, payload: false });
      return;
    }

    if (ownerData.data?.getOwner) {
      const cachedCurrentUser = JSON.parse((await AsyncStorage.getItem('@currentUser')) || '{}');

      const owner = ownerData.data.getOwner.owner;
      const pets = ownerData.data.getOwner.owner.Pets || [];

      console.log(owner);

      dispatch({ type: OWNER_DATA, payload: owner });
      dispatch({ type: PET_DATA, payload: pets });

      const validCache = owner?.id === cachedCurrentUser?.id || pets.find((pet) => pet?.id === cachedCurrentUser?.id) ? true : false;

      dispatch({ type: CURRENT_USER, payload: cachedCurrentUser && validCache ? cachedCurrentUser : { id: ownerData.data.getOwner.owner.id, isPet: false } });
      dispatch({ type: LOADING, payload: false });
    }
  }, [getUserData, navigationRef, dispatch]);

  return (
    <View className='bg-themeBg h-full'>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Host>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName='Loading'
            screenOptions={{
              headerShown: false,
              headerBackVisible: false,
              animationTypeForReplace: 'push',
              animation: 'fade',
              contentStyle: { backgroundColor: '#f6f6f6f' },
            }}>
            <Stack.Screen name='Loading' component={Loading} />
            <Stack.Screen name='Home' component={HomeNavigator} />
            <Stack.Screen name='Get Started' component={GetStarted} />
            <Stack.Screen name='Pet Creation' component={PetCreation} />
            <Stack.Screen name='Account Creation' component={AccountCreation} />
            <Stack.Screen
              name='Pet Profile'
              component={PetProfile}
              options={{
                headerShown: true,
                headerBackVisible: true,
                animation: 'default',
                animationTypeForReplace: 'push',
                contentStyle: { backgroundColor: '#f6f6f6f' },
                headerTransparent: true,
              }}
            />
            <Stack.Screen
              name='Owner Profile'
              component={OwnerProfilePage}
              options={{
                headerShown: true,
                headerBackVisible: true,
                animation: 'default',
                animationTypeForReplace: 'push',
                contentStyle: { backgroundColor: '#f6f6f6f' },
                headerTransparent: true,
              }}
            />
            <Stack.Screen
              name='New Post'
              component={PostPage}
              options={{
                headerShown: true,
                headerBackVisible: true,
                animation: 'slide_from_bottom',
                animationTypeForReplace: 'push',
                contentStyle: { backgroundColor: '#f6f6f6f' },
                headerTransparent: true,
              }}
            />
            <Stack.Screen
              name='Profile Picture'
              component={ProfilePicturePage}
              options={{
                headerShown: true,
                headerBackVisible: true,
                animation: 'slide_from_right',
                animationTypeForReplace: 'push',
                headerTitleStyle: { color: 'transparent' },
                contentStyle: { backgroundColor: '#f6f6f6f' },
                headerTransparent: true,
              }}
            />
            <Stack.Screen
              name='Profile Feed'
              component={ProfileFeed}
              options={{
                headerShown: true,
                headerBackVisible: true,
                animation: 'slide_from_right',
                animationTypeForReplace: 'push',
                contentStyle: { backgroundColor: '#f6f6f6f' },
                headerTransparent: true,
              }}
            />
            <Stack.Screen
              name='Following'
              component={FollowingPage}
              options={{
                headerShown: true,
                headerBackVisible: true,
                animation: 'slide_from_right',
                animationTypeForReplace: 'push',
                contentStyle: { backgroundColor: '#f6f6f6f' },
                headerTransparent: true,
              }}
            />
            <Stack.Screen
              name='Followers'
              component={FollowersPage}
              options={{
                headerShown: true,
                headerBackVisible: true,
                animation: 'slide_from_right',
                animationTypeForReplace: 'push',
                contentStyle: { backgroundColor: '#f6f6f6f' },
                headerTransparent: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Host>
    </View>
  );
};

export default () => {
  return (
    <AppLoader>
      <App />
    </AppLoader>
  );
};
