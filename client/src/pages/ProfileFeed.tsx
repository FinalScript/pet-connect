import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../../App';
import Post from '../components/Post';
import Text from '../components/Text';
import { useSelector } from 'react-redux';
import { ProfileReducer } from '../redux/reducers/profileReducer';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile Feed'>;

const ProfileFeed = ({
  navigation,
  route: {
    params: { petUsername, initialPostIndex },
  },
}: Props) => {
  const [postHeights, setPostHeights] = useState<number[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const posts = useSelector((state: ProfileReducer) => state.profile.posts);

  useEffect(() => {
    if (initialPostIndex !== undefined && postHeights.length > initialPostIndex) {
      const yOffset = postHeights.slice(0, initialPostIndex).reduce((acc, h) => acc + h, 0);
      scrollViewRef.current?.scrollTo({ y: yOffset, animated: false });
    }
  }, [postHeights, initialPostIndex]);

  useEffect(() => {
    navigation.setOptions({ title: `${petUsername}'s posts` });
  }, [petUsername]);

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
