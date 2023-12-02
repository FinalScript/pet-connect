import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import colors from '../../../config/tailwind/colors';
import { Ionicon } from '../../utils/Icons';
import Explore from './Explore';
import Feed from './Feed';
import Inbox from './Inbox';
import PostPage from './PostPage';
import Profile from './Profile';

export type HomeStackParamList = {
  Feed: undefined;
  Explore: undefined;
  PostPage: undefined;
  Inbox: undefined;
  Profile: undefined;
};

export type HomeRouteProps<RouteName extends keyof HomeStackParamList> = RouteProp<HomeStackParamList, RouteName>;

const Tab = createBottomTabNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  const [postPageModal, setPostPageModal] = useState(false);

  const _renderIcon = (routeName: string, selectedTab: string) => {
    let icon = '';

    switch (routeName) {
      case 'Feed':
        return <Ionicon name='home' size={20} />;
      case 'Explore':
        return <Ionicon name='search' size={20} />;
      case 'Inbox':
        return <Ionicon name='file-tray' size={20} />;
      case 'Profile':
        return <Ionicon name='person-circle' size={20} />;
    }

    return <Ionicon name={icon} size={25} color={routeName === selectedTab ? 'black' : 'gray'} />;
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }: any) => {
    return (
      <TouchableOpacity onPress={() => navigate(routeName)} style={styles.tabbarItem}>
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal animationType='slide' visible={postPageModal} presentationStyle='pageSheet' onRequestClose={() => setPostPageModal(false)}>
        <PostPage closeModal={() => setPostPageModal(false)} />
      </Modal>

      <NavigationContainer independent documentTitle={{ enabled: false }}>
        <CurvedBottomBar.Navigator
          screenOptions={{
            headerShown: false,
          }}
          type='UP'
          style={styles.bottomBar}
          shadowStyle={styles.shadow}
          height={66}
          circleWidth={50}
          bgColor={colors.themeBg}
          initialRouteName='Feed'
          borderTopLeftRight
          renderCircle={({ selectedTab, navigate }) => (
            <Animated.View style={styles.btnCircleUp}>
              <TouchableOpacity style={styles.button} onPress={() => setPostPageModal(true)}>
                <Ionicon name={'add'} color={colors.themeText} size={30} />
              </TouchableOpacity>
            </Animated.View>
          )}
          tabBar={renderTabBar}>
          <CurvedBottomBar.Screen name='Feed' position='LEFT' component={() => <Feed />} />
          <CurvedBottomBar.Screen name='Explore' component={() => <Explore />} position='LEFT' />
          <CurvedBottomBar.Screen name='Inbox' component={() => <Inbox />} position='RIGHT' />
          <CurvedBottomBar.Screen name='Profile' component={() => <Profile />} position='RIGHT' />
        </CurvedBottomBar.Navigator>
      </NavigationContainer>

      {/* <Tab.Navigator
        screenOptions={{ headerShown: false }}
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
                return options.tabBarIcon({ focused, color: colors.themeText, size: 30 });
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
      </Tab.Navigator> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shadow: {
    shadowColor: '#FF8770',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themeTabBg,
    bottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  img: {
    width: 30,
    height: 30,
  },
});

export default HomeNavigator;
