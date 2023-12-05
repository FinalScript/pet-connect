import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { PetDAO } from '../redux/reducers/profileReducer';
import Image from './Image';
import PetTypeImage from './PetTypeImage';
import Text from './Text';
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicon } from '../utils/Icons';
import colors from '../../config/tailwind/colors';
import { Pet } from '../__generated__/graphql';

interface Props {
  pet: Pet;
  isSelected: boolean;
  setIsSelected: Dispatch<SetStateAction<string | undefined>>;
  goToProfile: () => void;
}
const PetCard = ({ pet, goToProfile, isSelected, setIsSelected }: Props) => {
  const height = useSharedValue(80);

  useEffect(() => {
    if (isSelected) {
      height.value = withTiming(140);
    } else {
      height.value = withTiming(80);
    }
  }, [isSelected]);

  return (
    <Animated.View style={{ height }} className={'flex-1 rounded-2xl bg-themeInput shadow-sm shadow-themeShadow ' + (isSelected ? 'mb-6' : 'mb-3')}>
      <Pressable
        className={'flex flex-row flex-1'}
        onPress={() => {
          goToProfile();
        }}>
        <Animated.View style={{ width: height, minWidth: 80 }} className={'aspect-square flex justify-center items-center mr-5 p-1'}>
          {pet?.ProfilePicture?.url ? (
            <Image
              className='w-full h-full rounded-xl'
              source={{
                uri: pet.ProfilePicture.url,
              }}
            />
          ) : (
            (pet as PetDAO)?.type && <PetTypeImage type={(pet as PetDAO)?.type} className='w-10 h-10' />
          )}
        </Animated.View>
        <View className='flex justify-around h-full'>
          <View className='flex '>
            <View className='flex-row items-center'>
              <Text className='text-xl font-medium'>{pet?.name}</Text>
              {(pet as PetDAO)?.type && <PetTypeImage type={(pet as PetDAO)?.type} className='w-5 h-5 ml-2' />}
            </View>
            <Text className='text-sm'>@{pet?.username}</Text>
          </View>

          {isSelected && (
            <View className='flex-row '>
              <View className='flex items-center mr-3'>
                <Text className='text-base'>5</Text>
                <Text className='text-xs'>Posts</Text>
              </View>
              <View className='flex items-center mr-3'>
                <Text className='text-base'>20</Text>
                <Text className='text-xs'>Followers</Text>
              </View>
              <View className='flex items-center mr-3'>
                <Text className='text-base'>25</Text>
                <Text className='text-xs'>Likes</Text>
              </View>
            </View>
          )}
        </View>

        <View className='flex-1 flex-row justify-end'>
          <Pressable
            className='pr-5 pt-5'
            onPress={() => {
              setIsSelected((prev) => {
                if (prev === pet.id) {
                  return undefined;
                } else {
                  return pet.id;
                }
              });
            }}>
            {isSelected ? <Ionicon name='chevron-up' size={20} color={colors.themeText} /> : <Ionicon name='chevron-down' size={20} color={colors.themeText} />}
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default PetCard;
