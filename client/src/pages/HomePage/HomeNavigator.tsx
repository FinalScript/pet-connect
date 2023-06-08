import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import Feed from './Feed';
import Explore from './Explore';
import Inbox from './Inbox';
import Profile from './Profile';
import CameraView from './CameraView';
import { RouteProp } from '@react-navigation/native';

export type HomeStackParamList = {
  Feed: undefined;
  Explore: undefined;
  Camera: undefined;
  Inbox: undefined;
  Profile: undefined;
};

export type HomeRouteProps<RouteName extends keyof HomeStackParamList> = RouteProp<HomeStackParamList, RouteName>;

const Tab = createBottomTabNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 90,
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: '#fde1da',
          borderTopWidth: 2,
          borderTopColor: '#FF8770',
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FF8770',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name='Feed'
        component={Feed}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';

            iconName = focused ? 'home' : 'home-outline';

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name='Explore'
        component={Explore}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';

            iconName = focused ? 'search' : 'search-outline';

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />

      <Tab.Screen
        name='Camera'
        component={CameraView}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';

            iconName = focused ? 'plus-square-o' : 'plus-square-o';

            // You can return any component that you like here!
            return <FontAwesome name={iconName} size={size + 15} color={color} />;
          },
        }}
      />

      <Tab.Screen
        name='Inbox'
        component={Inbox}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';

            iconName = focused ? 'file-tray' : 'file-tray-outline';

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />

      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';

            iconName = focused ? 'person-circle' : 'person-circle-outline';

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;
