import React from 'react';
import FastImage from 'react-native-fast-image';

const Image = ({ ...rest }) => {
  return <FastImage {...rest} />;
};

export default Image;
