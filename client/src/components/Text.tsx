import React from 'react';
import { View, Text as T, TextProps, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  regular: {
    fontFamily: 'BalooChettan2-Regular',
  },
  medium: {
    fontFamily: 'BalooChettan2-Medium',
  },
  semibold: {
    fontFamily: 'BalooChettan2-SemiBold',
  },
  bold: {
    fontFamily: 'BalooChettan2-Bold',
  },
});
export default function Text(props: TextProps) {
  let baseStyle = styles.regular;

  // Multiple styles may be provided.
  (Array.isArray(props.style) ? props.style : [props.style]).forEach((style) => {
    if (style && style?.fontWeight) {
      switch (style.fontWeight) {
        case 500:
          baseStyle = styles.medium;
          break;
        case 600:
          baseStyle = styles.semibold;
          break;
        case 700:
          baseStyle = styles.bold;
          break;
        default:
          baseStyle = styles.regular;
          break;
      }
    }
  });

  return (
    <T {...props} className='text-themeText' style={[baseStyle, props.style]}>
      {props.children}
    </T>
  );
}
