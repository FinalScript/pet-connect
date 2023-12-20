import { useLazyQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, RouteProp, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Host } from 'react-native-portalize';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import { ProfilePicture as ProfilePictureType } from './src/__generated__/graphql';
import { VERIFY_TOKEN } from './src/graphql/Auth';
import { GET_OWNER } from './src/graphql/Owner';
import { GET_PETS_BY_OWNER_ID } from './src/graphql/Pet';
import AppLoader from './src/hoc/AppLoader';
import AccountCreation from './src/pages/AccountCreation';
import FollowersPage from './src/pages/Followers';
import FollowingPage from './src/pages/Following';
import GetStarted from './src/pages/GetStarted';
import HomeNavigator from './src/pages/HomePage/HomeNavigator';
import PostPage from './src/pages/HomePage/PostPage';
import Loading from './src/pages/Loading';
import OwnerProfilePage from './src/pages/OwnerProfilePage/OwnerProfilePage';
import PetCreation from './src/pages/PetCreation';
import PetProfile from './src/pages/PetProfile';
import ProfileFeed from './src/pages/ProfileFeed';
import ProfilePicturePage from './src/pages/ProfilePicture';
import { LOADING, OWNER_DATA, PET_DATA } from './src/redux/constants';
import { ProfileReducer } from './src/redux/reducers/profileReducer';
import { navigationRef } from './src/services/navigator';
import { options } from './src/utils/hapticFeedbackOptions';

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
  'Profile Feed': { petUsername: string; initialPostIndex: number };
  Following: { ownerId: string };
  Followers: { petId: string };
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<RootStackParamList, RouteName>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const dispatch = useDispatch();
  const [getUserData, { data: ownerData, error: ownerDataError }] = useLazyQuery(GET_OWNER);
  const [getPets] = useLazyQuery(GET_PETS_BY_OWNER_ID);
  const [verifyToken] = useLazyQuery(VERIFY_TOKEN);
  const { user, getCredentials } = useAuth0();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);

  useEffect(() => {
    getAuth();
  }, [user, navigationRef]);

  useEffect(() => {
    if (owner) {
      SplashScreen.hide();
      navigationRef.dispatch(StackActions.replace('Home'));
    }
  }, [owner?.id]);

  useEffect(() => {
    ownerDataError && console.error(ownerDataError, ownerDataError.message);

    if (ownerDataError && ownerDataError.message === 'Owner not found') {
      dispatch({ type: LOADING, payload: false });
      trigger(HapticFeedbackTypes.notificationWarning, options);
      SplashScreen.hide();
      navigationRef.dispatch(StackActions.replace('Account Creation'));
      return;
    }

    if (!ownerData) {
      dispatch({ type: LOADING, payload: false });
      return;
    }

    const owner = ownerData.getOwner.owner;

    getPets({ variables: { id: owner.id } }).then(({ data }) => {
      dispatch({ type: PET_DATA, payload: data?.getPetsByOwnerId.pets || [] });
    });

    dispatch({ type: OWNER_DATA, payload: owner });
    dispatch({ type: LOADING, payload: false });
  }, [ownerData, ownerDataError, getUserData, getPets, dispatch]);

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
      console.log('Token not found in cache');
      const credentials = await getCredentials('openid profile email');

      console.log('Fetching token from Auth0');
      if (!credentials?.accessToken) {
        console.log('Token not found from Auth0, redirecting to Get Started');
        dispatch({ type: LOADING, payload: false });
        SplashScreen.hide();
        navigationRef.dispatch(StackActions.replace('Get Started'));
        return;
      }

      console.log('Token found from Auth0');

      try {
        await AsyncStorage.setItem('@token', credentials.accessToken);
      } catch (error) {
        // Error saving data
      }

      await getUserData();

      return;
    }

    console.log('Token found in cache, veryifying token');

    const verifiedToken = await verifyToken();

    if (verifiedToken.error) {
      console.log("Error verifying token, redirecting to 'Get Started");
      console.log(verifiedToken.error);
      await AsyncStorage.removeItem('@token');
      dispatch({ type: LOADING, payload: false });
      SplashScreen.hide();
      navigationRef.dispatch(StackActions.replace('Get Started'));
      return;
    }

    console.log('Token verified, fetching user data');

    await getUserData();
  }, [navigationRef, dispatch, verifyToken]);

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
