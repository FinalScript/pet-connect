import React from 'react';
import { View, Text as T, TextProps } from 'react-native';

export default function Text(props: TextProps) {
  return (
    <T {...props} style={[{ fontFamily: 'Itim-Regular' }, props.style]}>
      {props.children}
    </T>
  );
}
