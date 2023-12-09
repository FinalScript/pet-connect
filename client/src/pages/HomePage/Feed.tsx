import { useQuery } from '@apollo/client';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { RefObject, useCallback, useMemo, useState } from 'react';
import { Animated, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import Post from '../../components/Post';
import Text from '../../components/Text';
import { GET_FOLLOWING, GET_FOR_YOU } from '../../graphql/Post';
import { themeConfig } from '../../utils/theme';

const Tab = createMaterialTopTabNavigator();

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
  scrollViewRef: RefObject<ScrollView>;
}

const Feed = ({ navigation, scrollViewRef }: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data: followingData, refetch: refetchFollowing } = useQuery(GET_FOLLOWING, { pollInterval: 10000 });
  const { data: forYouData, refetch: refetchForYou } = useQuery(GET_FOR_YOU, { pollInterval: 10000 });
  const following = useMemo(() => followingData?.getFollowing || [], [followingData]);
  const forYou = useMemo(() => forYouData?.getForYou || [], [forYouData]);
  const scrollY = new Animated.Value(0);

  const clampedTranslateY = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [20, 100],
        outputRange: [0, -100],
        extrapolateLeft: 'clamp',
      }),
    [scrollY]
  );

  const clampedOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, 40],
        outputRange: [1, 0],
        extrapolateLeft: 'clamp',
      }),
    [scrollY]
  );

  const onRefreshForYou = useCallback(async () => {
    setRefreshing(true);

    setTimeout(() => {
      refetchForYou();
      setRefreshing(false);
    }, 600);
  }, []);

  const onRefreshFollowing = useCallback(async () => {
    setRefreshing(true);

    setTimeout(() => {
      refetchFollowing();
      setRefreshing(false);
    }, 600);
  }, []);

  return (
    <SafeAreaView className={'flex-1 h-full bg-themeBg'}>
      <Tab.Navigator
        initialRouteName='Following'
        screenOptions={{
          tabBarPressOpacity: 1,
          tabBarPressColor: 'rgba(0,0,0,0)',
          tabBarActiveTintColor: themeConfig.customColors.themeText,
          tabBarContentContainerStyle: {
            alignItems: 'center',
            justifyContent: 'center',
          },
          tabBarIndicatorStyle: { display: 'none' },
          tabBarItemStyle: {
            width: 120,
            paddingHorizontal: 0,
            position: 'relative',
            padding: 0,
            height: 45,
          },
          tabBarLabelStyle: {
            fontSize: 15,
            fontFamily: 'BalooChettan2-Regular',
          },
          tabBarStyle: {
            width: 'auto',
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            left: 50,
            right: 50,
            height: 20,
            opacity: clampedOpacity,
            transform: [{ translateY: clampedTranslateY }],
          },
        }}>
        <Tab.Screen
          name='Explore'
          children={() => {
            return (
              <View className='flex-1 h-full bg-themeBg'>
                <Animated.ScrollView
                  ref={scrollViewRef}
                  scrollEventThrottle={16}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                  className='w-full pt-10'
                  refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefreshForYou} />}>
                  <View className='flex justify-center items-center h-full pb-[100px]'>
                    {forYou.map((post, i) => {
                      return (
                        <Post
                          key={i}
                          post={post}
                          goToProfile={() => {
                            navigation.navigate('Pet Profile', { petId: post.author.id });
                          }}
                        />
                      );
                    })}
                    {forYou.length === 0 && (
                      <>
                        <Text>Nothing to see here...</Text>
                      </>
                    )}
                  </View>
                </Animated.ScrollView>
              </View>
            );
          }}
        />
        <Tab.Screen
          name='Following'
          children={() => {
            return (
              <View className='flex-1 h-full bg-themeBg'>
                <Animated.ScrollView
                  ref={scrollViewRef}
                  scrollEventThrottle={16}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                  className='w-full pt-10'
                  refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefreshFollowing} />}>
                  <View className='flex justify-center items-center h-full pb-[100px]'>
                    {following.map((post, i) => {
                      return (
                        <Post
                          key={i}
                          post={post}
                          goToProfile={() => {
                            navigation.navigate('Pet Profile', { petId: post.author.id });
                          }}
                        />
                      );
                    })}
                    {following.length === 0 && (
                      <>
                        <Text>Nothing to see here...</Text>
                      </>
                    )}
                  </View>
                </Animated.ScrollView>
              </View>
            );
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Feed;
