import React, { useState } from 'react';
import { View, Image, TouchableWithoutFeedback, Button } from 'react-native';
import { styled } from 'nativewind';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import Text from '../components/Text';

const StyledButton = styled(Button);

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
    <View className='bg-[#fde1da] h-screen p-5 flex flex-col justify-between'>
      <View className='mt-10'>
        <Text className='text-[#232323] font-semibold text-3xl'>Let your pet come sit on my lap... oh yeah</Text>

        <View className='mt-14 flex flex-wrap flex-row justify-center'>
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
                    ' mb-5 mx-2.5 p-5 bg-[#fff4f3] border-4 shadow-md shadow-[#e47167] w-40 h-40 rounded-3xl flex items-center'
                  }>
                  <Image className='flex w-full h-[80%] aspect-square opacity-70' source={pet.img} />
                  <Text className='mt-2 text-lg'>{pet.type}</Text>
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
        <TouchableWithoutFeedback>
          <Text className='text-xl text-[#c07c4e]'>Skip</Text>
        </TouchableWithoutFeedback>

        <TouchableOpacity>
          <View className='bg-[#FFBA93] px-6 py-2 rounded-3xl'>
            <Text className='text-2xl text-black'>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
