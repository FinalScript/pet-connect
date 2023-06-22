import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

interface Props{
  children: string | JSX.Element | JSX.Element[],
  delay?: number,
  onDoubleTap: Function
}

export default function DoubleTap({ children, delay = 300, onDoubleTap = () => null }: Props) {
  let lastTap: number;
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
