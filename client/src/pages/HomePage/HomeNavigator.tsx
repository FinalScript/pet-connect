import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { useState } from 'react';
import Feed from './Feed';
import Explore from './Explore';
import Inbox from './Inbox';
import Profile from './Profile';
import { RouteProp } from '@react-navigation/native';
import { Ionicon } from '../../utils/Icons';
import PostPage from './PostPage';
import { Text, BottomNavigation } from 'react-native-paper';
import colors from '../../../config/tailwind/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Modal, View } from 'react-native';

export type HomeStackParamList = {
  Feed: undefined;
  Explore: undefined;
  PostPage: undefined;
  Inbox: undefined;
  Profile: undefined;
};

export type HomeRouteProps<RouteName extends keyof HomeStackParamList> = RouteProp<HomeStackParamList, RouteName>;

const Tab = createMaterialTopTabNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  const [postPageModal, setPostPageModal] = useState(false);

  return (
    <>
      <Modal animationType='slide' visible={postPageModal} presentationStyle='pageSheet' onRequestClose={() => setPostPageModal(false)}>
        <PostPage closeModal={() => setPostPageModal(false)} />
      </Modal>
      <Tab.Navigator
        tabBarPosition='bottom'
        screenOptions={{ animationEnabled: false, swipeEnabled: false, lazy: true }}
        tabBar={({ navigation, state, descriptors }) => (
          <BottomNavigation.Bar
            navigationState={state}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.navigate(route.name, route.params);
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({ focused, color, size: 30 });
              }

              return null;
            }}
            theme={{ colors: { secondaryContainer: 'transparent' } }}
            style={{ height: 90, backgroundColor: colors.themeBg, borderTopColor: '#FF8770', borderTopWidth: 2 }}
          />
        )}>
        <Tab.Screen
          name='Feed'
          component={Feed}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = '';

              iconName = focused ? 'home' : 'home-outline';

              return <Ionicon name={iconName} size={size} color={color} />;
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

              return <Ionicon name={iconName} size={size} color={color} />;
            },
          }}
        />

        <Tab.Screen
          name='PostPage'
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setPostPageModal(true);
            },
          }}
          component={PostPage}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = '';

              iconName = focused ? 'plus-square-o' : 'plus-square-o';

              return <FontAwesome name={iconName} size={size} color={color} />;
            },

            tabBarStyle: {
              display: 'none',
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

              return <Ionicon name={iconName} size={size} color={color} />;
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

              return <Ionicon name={iconName} size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default HomeNavigator;
