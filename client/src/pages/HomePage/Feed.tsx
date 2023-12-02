import { useLazyQuery } from '@apollo/client';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../../config/tailwind/colors';
import Post from '../../components/Post';
import Text from '../../components/Text';
import { GET_ALL_POSTS } from '../../graphql/Post';
import { REPLACE_FEED } from '../../redux/constants';
import { GeneralReducer } from '../../redux/reducers/generalReducer';

const Tab = createMaterialTopTabNavigator();

const Feed = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [getAllPosts] = useLazyQuery(GET_ALL_POSTS, { fetchPolicy: 'network-only' });
  const posts = useSelector((state: GeneralReducer) => state.general.feedPosts);
  const scrollY = new Animated.Value(0);

  const clampedTranslateY = scrollY.interpolate({
    inputRange: [20, 100],
    outputRange: [0, -100],
    extrapolateLeft: 'clamp',
  });

  const clampedOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolateLeft: 'clamp',
  });

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const fetchedPosts = await getAllPosts();

    if (fetchedPosts.data?.getAllPosts.posts) {
      dispatch({ type: REPLACE_FEED, payload: fetchedPosts.data.getAllPosts.posts });
      return;
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    setTimeout(() => {
      getPosts();
      setRefreshing(false);
    }, 600);
  }, [getPosts]);

  return (
    <SafeAreaView className={'flex-1 h-full bg-themeBg'}>
      <Tab.Navigator
        initialRouteName='For You'
        screenOptions={{
          tabBarPressOpacity: 1,
          tabBarPressColor: 'rgba(0,0,0,0)',
          tabBarActiveTintColor: colors.themeText,
          tabBarContentContainerStyle: {
            alignItems: 'center',
            justifyContent: 'center',
          },
          tabBarIndicatorStyle: { display: 'none' },
          tabBarItemStyle: {
            width: 100,
            paddingHorizontal: 0,
            position: 'relative',
            padding: 0,
            height: 45,
          },
          tabBarLabelStyle: {
            fontSize: 18,
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
          name='Following'
          children={() => {
            return (
              <View className='flex-1 h-full bg-themeBg'>
                <Animated.ScrollView
                  scrollEventThrottle={16}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                  className='w-full pt-10'
                  refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefresh} />}>
                  <View className='flex justify-center items-center h-full pb-5 px-3'>
                    <>
                      <Text>Nothing to see here...</Text>
                    </>
                  </View>
                </Animated.ScrollView>
              </View>
            );
          }}
        />
        <Tab.Screen
          name='For You'
          children={() => {
            return (
              <View className='flex-1 h-full bg-themeBg'>
                <Animated.ScrollView
                  scrollEventThrottle={16}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                  className='w-full pt-10'
                  refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefresh} />}>
                  <View className='flex justify-center items-center h-full pb-[100px]'>
                    {posts.map((post, i) => {
                      return <Post key={i} post={post} />;
                    })}
                    {posts.length === 0 && (
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
