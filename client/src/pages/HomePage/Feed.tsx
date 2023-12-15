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
import { useIsFocused } from '@react-navigation/native';
import { Post as PostType } from '../../__generated__/graphql';

const Tab = createMaterialTopTabNavigator();

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
  scrollViewRef: RefObject<ScrollView>;
}

const Feed = ({ navigation, scrollViewRef }: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data: followingData, refetch: refetchFollowing } = useQuery(GET_FOLLOWING);
  const { data: forYouData, refetch: refetchForYou } = useQuery(GET_FOR_YOU);
  const following: PostType[] = useMemo(() => {
    console.log(followingData?.getFollowing);
    return followingData?.getFollowing || [];
  }, [followingData]);
  const forYou: PostType[] = useMemo(() => {
    console.log(forYouData?.getForYou);
    return forYouData?.getForYou || [];
  }, [forYouData]);

  const onRefreshForYou = useCallback(async () => {
    setRefreshing(true);

    setTimeout(() => {
      refetchForYou();
      setRefreshing(false);
    }, 600);
  }, [setRefreshing, refetchForYou]);

  const onRefreshFollowing = useCallback(async () => {
    setRefreshing(true);

    setTimeout(() => {
      refetchFollowing();
      setRefreshing(false);
    }, 600);
  }, [setRefreshing, refetchFollowing]);
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
          },
        }}>
        <Tab.Screen
          name='Explore'
          children={() => {
            return <ExploreTab innerRef={scrollViewRef} posts={forYou} refreshing={refreshing} onRefresh={onRefreshForYou} navigation={navigation} />;
          }}
        />
        <Tab.Screen
          name='Following'
          children={() => {
            return <FollowingTab innerRef={scrollViewRef} posts={following} refreshing={refreshing} onRefresh={onRefreshFollowing} navigation={navigation} />;
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

interface TabProps {
  innerRef: RefObject<ScrollView>;
  posts: PostType[];
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
}

const ExploreTab = ({ innerRef, posts, refreshing, onRefresh, navigation }: TabProps) => {
  const isFocused = useIsFocused();

  return (
    <View className='flex-1 h-full bg-themeBg'>
      <ScrollView
        ref={isFocused ? innerRef : null}
        scrollEventThrottle={16}
        className='w-full pt-10'
        refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className='flex justify-center items-center h-full pb-[100px]'>
          {posts.map((post, i) => {
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
          {posts.length === 0 && (
            <>
              <Text>Nothing to see here...</Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const FollowingTab = ({ innerRef, posts, refreshing, onRefresh, navigation }: TabProps) => {
  const isFocused = useIsFocused();

  return (
    <View className='flex-1 h-full bg-themeBg'>
      <ScrollView
        ref={isFocused ? innerRef : null}
        scrollEventThrottle={16}
        className='w-full pt-10'
        refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className='flex justify-center items-center h-full pb-[100px]'>
          {posts.map((post, i) => {
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
          {posts.length === 0 && (
            <>
              <Text>Nothing to see here...</Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Feed;
