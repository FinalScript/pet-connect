import { useEffect } from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth0 } from 'react-native-auth0';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { options } from '../utils/hapticFeedbackOptions';
import { Directions, Gesture, GestureDetector, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Text from '../components/Text';
import React from 'react';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Get Started'>;

export default function GetStarted() {
  const { authorize } = useAuth0();
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  }, [offset]);

  useEffect(() => {
    const interval = setInterval(() => {
      offset.value = withSpring(0);

      setTimeout(() => {
        offset.value = withSpring(15);
      }, 200);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const login = async () => {
    trigger(HapticFeedbackTypes.impactHeavy, options);
    authorize({ scope: 'openid profile email', audience: 'https://pet-app.com/api/v2' });
  };

  const flingGestureLeft = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => login());

  return (
    <GestureDetector gesture={flingGestureLeft}>
      <SafeAreaView className='bg-themeBg h-full'>
        <View className='absolute -z-10 bottom-0 w-full h-full shadow-lg shadow-red-600'>
          <Image className='flex w-full h-full' source={require('../../assets/img/wave-haikei.png')} />
        </View>
        <View className='h-full p-5 flex flex-col justify-between'>
          <View className='mt-16 flex flex-col items-center justify-center'>
            <View className='w-[180px] h-[180px] shadow-md shadow-themeShadowLight'>
              <Image className='flex w-full h-full aspect-square' source={require('../../assets/img/cat-logo.png')} />
            </View>
            <Text className='mt-5 text-themeText font-semibold text-4xl'>Pet Connect</Text>
          </View>

          <View className='mx-10'>
            <TouchableWithoutFeedback className='bg-transparent' onPress={login}>
              <View className='p-10 flex flex-row justify-center items-center'>
                <Animated.View style={[animatedStyles]}>
                  <Text className='text-3xl font-semibold text-themeText'>Get Started</Text>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </SafeAreaView>
    </GestureDetector>
  );
}
