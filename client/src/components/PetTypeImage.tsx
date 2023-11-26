import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { Image } from 'react-native';
import { PetType } from '../redux/reducers/profileReducer';

const petTypes = [
  { type: PetType.Dog, img: require('../../assets/img/dog.png') },
  { type: PetType.Cat, img: require('../../assets/img/cat.png') },
  { type: PetType.Bird, img: require('../../assets/img/bird.png') },
  { type: PetType.Fish, img: require('../../assets/img/fish.png') },
  { type: PetType.Rabbit, img: require('../../assets/img/rabbit.png') },
  { type: PetType.Hamster, img: require('../../assets/img/hamster.png') },
  { type: PetType.Snake, img: require('../../assets/img/reptile.png') },
  { type: PetType.Other, img: require('../../assets/img/other.png') },
];

interface Props extends ViewProps {
  type: PetType;
}

const PetTypeImage = ({ type, ...rest }: Props) => {
  const source = useMemo(() => {
    return petTypes.find((i) => {
      return i.type === type;
    })?.img;
  }, [type]);

  return (
    <View {...rest}>
      <Image className='h-full w-full opacity-70' source={source} />
    </View>
  );
};

export default PetTypeImage;
