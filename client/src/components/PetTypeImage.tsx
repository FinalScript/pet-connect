import { View, Text } from 'react-native';
import React from 'react';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { Image } from 'react-native';

const petTypes = {
  DOG: require('../../assets/img/dog.png'),
  CAT: require('../../assets/img/cat.png'),
  BIRD: require('../../assets/img/bird.png'),
  FISH: require('../../assets/img/fish.png'),
  RABBIT: require('../../assets/img/rabbit.png'),
  HAMSTER: require('../../assets/img/hamster.png'),
  REPTILE: require('../../assets/img/reptile.png'),
  OTHER: require('../../assets/img/other.png'),
};

interface Props extends ViewProps {
  type: 'DOG' | 'CAT' | 'BIRD' | 'FISH' | 'RABBIT' | 'HAMSTER' | 'REPTILE' | 'OTHER';
}

const PetTypeImage = ({ type, ...rest }: Props) => {
  return (
    <View {...rest}>
      <Image className='h-full w-full' source={petTypes[type]} />
    </View>
  );
};

export default PetTypeImage;
