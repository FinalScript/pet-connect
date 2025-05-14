import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import Post from '../components/Post';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile Feed'>;

const ProfileFeed = ({
  navigation,
  route: {
    params: { petUsername, initialPostIndex, posts },
  },
}: Props) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({ title: `${petUsername}'s posts` });
  }, [petUsername]);

  return (
    <SafeAreaView className={'flex-1 h-full bg-themeBg'}>
      {posts && (
        <FlatList
          data={posts}
          initialScrollIndex={initialPostIndex}
          snapToInterval={Dimensions.get('window').height - insets.top + 25}
          snapToAlignment={'start'}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={{ height: Dimensions.get('screen').height - insets.top + 25 }}>
              <Post post={item} goToProfile={() => navigation.push('Pet Profile', { petId: item.Author.id })} navigation={navigation as any} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileFeed;
