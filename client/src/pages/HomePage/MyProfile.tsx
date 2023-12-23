import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import Text from '../../components/Text';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import { FontAwesome, Ionicon } from '../../utils/Icons';
import { themeConfig } from '../../utils/theme';
import OwnerProfile from '../OwnerProfilePage/OwnerProfile';
import React from 'react';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
}

const MyProfile = ({ navigation }: Props) => {
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);

  return (
    <SafeAreaView className='flex-1 h-full items-center bg-themeBg'>
      <View className='flex-row items-center justify-between w-full px-5'>
        <View className='flex-row items-center gap-x-2'>
          <FontAwesome name='lock' style={{ marginBottom: 5 }} size={25} color={themeConfig.customColors.themeText} />
          <Text className='font-bold text-3xl'>{owner?.username}</Text>
        </View>

        <Pressable
          onPress={() => {
            navigation.navigate('Settings Page');
          }}>
          <Ionicon name='menu-outline' size={30} />
        </Pressable>
      </View>
      {owner && owner.id && <OwnerProfile ownerId={owner.id} navigation={navigation as any} />}
    </SafeAreaView>
  );
};

export default MyProfile;
