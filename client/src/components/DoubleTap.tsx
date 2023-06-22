import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

export default function DoubleTap({ children, delay = 300, onDoubleTap = () => null }: any) {
  let lastTap: any = null;
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < delay) {
      onDoubleTap();
    } else {
      lastTap = now;
    }
  };

  return <TouchableWithoutFeedback onPress={handleDoubleTap}>{children}</TouchableWithoutFeedback>;
}
