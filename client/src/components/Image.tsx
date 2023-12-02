import React from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';

const Image = ({ ...rest }: FastImageProps) => {
  return <FastImage {...rest} />;
};

export default Image;
