import { useEffect } from 'react';
import { View, Image, Pressable } from 'react-native';
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
    }, 3000);

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
        <View className='h-full p-5 flex flex-col justify-between'>
          <View className='mt-5 flex flex-col items-center justify-center'>
            <View className='w-[200px] h-[200px]'>
              <Image className='flex w-full h-full aspect-square' source={require('../../assets/img/app-logo.png')} />
            </View>

            <Text className='pt-6 text-themeText font-semibold text-5xl'>Pet Connect</Text>
          </View>

          <View className='flex items-center mb-5'>
            <Animated.View style={[animatedStyles]}>
              <Pressable className='bg-themeBtn px-10 py-3 rounded-full' onPress={login}>
                <View className='flex flex-row justify-center items-center'>
                  <Text className='text-2xl font-semibold text-themeText -mb-1'>Get Started</Text>
                </View>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </GestureDetector>
  );
}
