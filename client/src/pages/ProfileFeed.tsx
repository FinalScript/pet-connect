import { useLazyQuery } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, RefreshControl, SafeAreaView, View, ScrollView } from 'react-native';
import { RootStackParamList } from '../../App';
import Post from '../components/Post';
import Text from '../components/Text';
import { GET_POSTS_BY_PET_ID } from '../graphql/Post';
import { GET_PET_BY_ID } from '../graphql/Pet';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile Feed'>;

const ProfileFeed = ({
  navigation,
  route: {
    params: { petId, initialPostIndex },
  },
}: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);
  const [getPet, { data: petData }] = useLazyQuery(GET_PET_BY_ID, { fetchPolicy: 'network-only' });
  const [getPostsByPetId, { data: postsData, refetch }] = useLazyQuery(GET_POSTS_BY_PET_ID, { fetchPolicy: 'network-only' });
  const [postHeights, setPostHeights] = useState<number[]>([]);

  const pet = useMemo(() => petData?.getPetById.pet, [petData, petId]);
  const posts = useMemo(() => postsData?.getPostsByPetId.posts, [postsData]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    getPet({ variables: { id: petId } });
    getPostsByPetId({ variables: { petId } });
  }, [petId, getPet, getPostsByPetId]);

  useEffect(() => {
    if (initialPostIndex !== undefined && postHeights.length > initialPostIndex) {
      const yOffset = postHeights.slice(0, initialPostIndex).reduce((acc, h) => acc + h, 0);
      scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
    }
  }, [postHeights, initialPostIndex]);

  useEffect(() => {
    navigation.setOptions({ title: pet?.username });
  }, [pet]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handlePostHeight = (index: number, height: number) => {
    setPostHeights((currentHeights) => {
      const newHeights = currentHeights.length >= (posts?.length || 0) ? [...currentHeights] : Array(posts?.length || 0).fill(0);

      newHeights[index] = height;
      return newHeights;
    });
  };

  return (
    <SafeAreaView className={'flex-1 h-full bg-themeBg'}>
      <View className='flex-1 h-full bg-themeBg'>
        <Animated.ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ref={scrollViewRef}
          className='w-full pt-10'>
          <View className='flex justify-center items-center h-full pb-[100px]'>
            {posts?.map((post, index) => (
              <Post
                key={index}
                post={post}
                goToProfile={() => navigation.navigate('Pet Profile', { petId: post.author.id })}
                onLayoutChange={(height) => handlePostHeight(index, height)}
              />
            ))}
            {posts?.length === 0 && <Text>Nothing to see here...</Text>}
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileFeed;
