import { useQuery } from '@apollo/client';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { RefObject, useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../App';
import { Post as PostType } from '../../__generated__/graphql';
import Post from '../../components/Post';
import { GET_FOLLOWING, GET_FOR_YOU } from '../../graphql/Post';
import { themeConfig } from '../../utils/theme';
import Text from '../../components/Text';

const Tab = createMaterialTopTabNavigator();

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
  followingFlatListRef: RefObject<FlatList>;
  forYouFlatListRef: RefObject<FlatList>;
}

const Feed = ({ navigation, followingFlatListRef, forYouFlatListRef }: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data: followingData, refetch: refetchFollowing } = useQuery(GET_FOLLOWING);
  const { data: forYouData, refetch: refetchForYou } = useQuery(GET_FOR_YOU);
  const following: PostType[] = useMemo(() => {
    return followingData?.getFollowing || [];
  }, [followingData]);
  const forYou: PostType[] = useMemo(() => {
    return forYouData?.getForYou || [];
  }, [forYouData]);
  const insets = useSafeAreaInsets();

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
    <SafeAreaView className={'flex-1 h-full bg-themeBg'} style={{ marginBottom: 80 }}>
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
            return <ExploreTab innerRef={forYouFlatListRef} posts={forYou} refreshing={refreshing} onRefresh={onRefreshForYou} navigation={navigation} />;
          }}
        />
        <Tab.Screen
          name='Following'
          children={() => {
            return (
              <FollowingTab innerRef={followingFlatListRef} posts={following} refreshing={refreshing} onRefresh={onRefreshFollowing} navigation={navigation} />
            );
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

interface TabProps {
  innerRef: RefObject<FlatList>;
  posts: PostType[];
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
}

const ExploreTab = ({ innerRef, posts, refreshing, onRefresh, navigation }: TabProps) => {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  return (
    <View className='pt-[35px] flex-1 h-full bg-themeBg'>
      <FlatList
        ref={innerRef}
        data={posts}
        snapToInterval={Dimensions.get('window').height}
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ height: Dimensions.get('screen').height, paddingTop: insets.top + 30 }}>
            <Post
              post={item}
              goToProfile={() => {
                navigation.push('Pet Profile', { petId: item.Author.id });
              }}
              navigation={navigation}
            />
          </View>
        )}
        refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const FollowingTab = ({ innerRef, posts, refreshing, onRefresh, navigation }: TabProps) => {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  return (
    <View className='pt-[35px] flex-1 h-full bg-themeBg'>
      <FlatList
        ref={innerRef}
        data={posts}
        snapToInterval={Dimensions.get('window').height}
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className='pt-5 flex-1 justify-center items-center'>
            <Text className='text-themeText text-xl font-bold'>You aren't following anyone yet!</Text>
            <Text className='text-themeText text-base font-semibold'>Go to the explore tab to find some pets to follow!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ height: Dimensions.get('screen').height, paddingTop: insets.top + 30 }}>
            <Post
              post={item}
              goToProfile={() => {
                navigation.push('Pet Profile', { petId: item.Author.id });
              }}
              navigation={navigation}
            />
          </View>
        )}
        refreshControl={<RefreshControl tintColor={'black'} refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default Feed;
