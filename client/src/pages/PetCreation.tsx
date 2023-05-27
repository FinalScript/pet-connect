import React, { useState } from 'react';
import { View, Image, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, Button } from 'react-native';
import { styled } from 'nativewind';
import Text from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function PetCreation() {
  const [selectedPetType, setSelectedPetType] = useState<string>();
  const [shuffle, setShuffle] = useState(0);

  return (
    <SafeAreaView className='bg-[#fde1da] h-screen p-5 flex flex-col justify-between'>
      <View>
        <Text className='text-[#232323] font-semibold text-3xl'>Let your pet come sit on my lap... oh yeah</Text>

        <View className='mt-14 -mx-5 flex flex-wrap flex-row justify-center'>
          {petTypes.slice(shuffle, shuffle + 4).map((pet) => {
            return (
              <TouchableWithoutFeedback
                key={pet.type}
                onPress={() => {
                  setSelectedPetType(pet.type);
                }}>
                <View
                  className={
                    (selectedPetType === pet.type ? 'border-[#FFBA93]' : 'border-transparent') +
                    ' mb-5 mx-2.5 p-5 bg-[#fff4f3] border-[5px] shadow-md shadow-[#e47167a2] w-36 h-36 rounded-3xl flex items-center'
                  }>
                  <Image className='flex w-full h-[80%] aspect-square opacity-70' source={pet.img} />
                  <Text className='mt-1 text-lg text-[#232323]'>{pet.type}</Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>

        <View className='mt-10 flex flex-row justify-center'>
          <TouchableWithoutFeedback
            onPress={() => {
              if (shuffle + 4 >= petTypes.length) {
                setShuffle(0);
              } else {
                setShuffle((prev) => prev + 4);
              }

              setSelectedPetType('');
            }}>
            <Text className='text-[#505050] text-xl'>See more options...</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View className='mb-5 mx-2 flex flex-row justify-between items-center'>
        <TouchableOpacity>
          <View className='px-6 py-1 rounded-3xl'>
            <Text className='text-xl text-[#c07c4e]'>Skip</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View className='bg-[#FFBA93] px-6 py-1 rounded-3xl  flex flex-row justify-center items-center'>
            <Text className='text-xl text-black leading-none text-center'>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
