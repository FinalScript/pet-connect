import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { RootStackParamList } from '../../../App';
import { Ionicon } from '../../utils/Icons';
import { themeConfig } from '../../utils/theme';
import Explore from './Explore';
import Feed from './Feed';
import Inbox from './Inbox';
import MyProfile from './MyProfile';
import { useSelector } from 'react-redux';
import { ProfileReducer } from '../../redux/reducers/profileReducer';

export type HomeStackParamList = {
  Feed: undefined;
  Explore: undefined;
  Inbox: undefined;
  Profile: undefined;
};

export type HomeRouteProps<RouteName extends keyof HomeStackParamList> = RouteProp<HomeStackParamList, RouteName>;

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeNavigator = ({ navigation }: HomeScreenProps) => {
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const feedScrollViewRef = useRef<ScrollView>(null);

  const _renderIcon = (routeName: string, selectedTab: string) => {
    let icon = '';

    switch (routeName) {
      case 'Feed':
        return <Ionicon name='home' size={25} color={themeConfig.customColors.themeText} />;
      case 'Explore':
        return <Ionicon name='search' size={25} color={themeConfig.customColors.themeText} />;
      case 'Inbox':
        return <Ionicon name='file-tray' size={25} color={themeConfig.customColors.themeText} />;
      case 'Profile':
        return <Ionicon name='person-circle' size={25} color={themeConfig.customColors.themeText} />;
    }

    return <Ionicon name={icon} size={25} color={routeName === selectedTab ? 'black' : 'gray'} />;
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (routeName === 'Feed') {
            feedScrollViewRef.current?.scrollTo({ y: 0 });
          }
          navigate(routeName);
        }}
        style={styles.tabbarItem}>
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <NavigationContainer independent documentTitle={{ enabled: false }}>
        <CurvedBottomBar.Navigator
          screenOptions={{
            headerShown: false,
          }}
          type='UP'
          style={styles.bottomBar}
          shadowStyle={styles.shadow}
          height={75}
          circleWidth={50}
          bgColor={themeConfig.customColors.themeInput}
          initialRouteName='Feed'
          borderTopLeftRight
          renderCircle={({ selectedTab, navigate }) => (
            <TouchableOpacity
              onPress={() => {
                if (pets.length === 0) {
                  navigation.navigate('Pet Creation');
                  return;
                }

                navigation.navigate('New Post');
              }}>
              <View style={styles.btnCircleUp}>
                <Ionicon name={'paw'} color={themeConfig.customColors.themeText} size={25} />
              </View>
            </TouchableOpacity>
          )}
          tabBar={renderTabBar}>
          <CurvedBottomBar.Screen name='Feed' position='LEFT' component={() => <Feed navigation={navigation} scrollViewRef={feedScrollViewRef} />} />
          <CurvedBottomBar.Screen name='Explore' component={() => <Explore navigation={navigation} />} position='LEFT' />
          <CurvedBottomBar.Screen name='Inbox' component={() => <Inbox navigation={navigation} />} position='RIGHT' />
          <CurvedBottomBar.Screen name='Profile' component={() => <MyProfile navigation={navigation} />} position='RIGHT' />
        </CurvedBottomBar.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shadow: {
    shadowColor: themeConfig.customColors.themeBtn,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },

  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeConfig.customColors.themeBtn,
    bottom: 18,
    shadowColor: themeConfig.customColors.themeShadowLight,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
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
