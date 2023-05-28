import React, { useCallback, useState } from 'react';
import { View, Image, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, Button } from 'react-native';
import Text from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trigger, HapticOptions, HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { options } from '../utils/hapticFeedbackOptions';

const petTypes = [
  { type: 'Dog', img: require('../../assets/img/dog.png') },
  { type: 'Cat', img: require('../../assets/img/cat.png') },
  { type: 'Bird', img: require('../../assets/img/bird.png') },
  { type: 'Fish', img: require('../../assets/img/fish.png') },
  { type: 'Rabbit', img: require('../../assets/img/rabbit.png') },
  { type: 'Hamster', img: require('../../assets/img/hamster.png') },
  { type: 'Reptile', img: require('../../assets/img/reptile.png') },
  { type: 'Other', img: require('../../assets/img/other.png') },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Pet Creation'>;

export default function PetCreation() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedPetType, setSelectedPetType] = useState<string>();
  const [shuffle, setShuffle] = useState(0);

  const petTypeOnPress = useCallback((type: string) => {
    setSelectedPetType(type);
    trigger(HapticFeedbackTypes.impactMedium, options);
  }, []);

  const moreOptionsOnPress = useCallback(() => {
    if (shuffle + 4 >= petTypes.length) {
      setShuffle(0);
    } else {
      setShuffle((prev) => prev + 4);
    }

    setSelectedPetType('');

    trigger(HapticFeedbackTypes.impactMedium, options);
  }, [shuffle]);

  const skipOnPress = useCallback(() => {
    trigger(HapticFeedbackTypes.impactMedium, options);
    navigation.replace('Home');
  }, []);

  const nextOnPress = useCallback(() => {
    trigger(HapticFeedbackTypes.impactMedium, options);
  }, []);

  return (
    <SafeAreaView className='bg-[#fde1da] h-full p-5 flex flex-col justify-between'>
      <View>
        <Text className='text-[#232323] font-semibold text-2xl'>Time to build your pet's profile! Start by selecting the pet type.</Text>

        <View className='mt-14 -mx-5 flex flex-wrap flex-row justify-center'>
          {petTypes.slice(shuffle, shuffle + 4).map((pet) => {
            return (
              <TouchableWithoutFeedback
                key={pet.type}
                onPress={() => {
                  petTypeOnPress(pet.type);
                }}>
                <View
                  className={
                    (selectedPetType === pet.type ? 'border-[#FFBA93]' : 'border-transparent') +
                    ' mb-5 mx-2.5 p-5 bg-[#fff4f3] border-[5px] shadow-md shadow-[#e47167a2] w-36 h-36 rounded-3xl flex items-center'
                  }>
                  <Image className='flex w-full h-[75%] aspect-square opacity-70' source={pet.img} />
                  <Text className='mt-1 text-md text-[#000000bb]'>{pet.type}</Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>

        <View className='mt-10 flex flex-row justify-center'>
          <TouchableOpacity onPress={moreOptionsOnPress}>
            <Text className='text-[#505050] text-lg p-2'>See more options...</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className='mb-5 mx-2 flex flex-row justify-between items-center'>
        <TouchableOpacity onPress={skipOnPress} activeOpacity={0.6}>
          <View className='px-6 py-2 rounded-3xl'>
            <Text className='text-xl text-[#c07c4e]'>Skip</Text>
          </View>
        </TouchableOpacity>

        <TouchableHighlight className='bg-[#FFBA93] rounded-3xl shadow-md shadow-[#e47167a2]' underlayColor={'#c59071'} onPress={nextOnPress}>
          <View className='px-6 py-1 flex flex-row justify-center items-center'>
            <Text className='text-xl font-semibold text-black'>Next</Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}
