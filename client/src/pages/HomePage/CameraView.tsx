import { View, Text, Linking, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, CameraProps, useCameraDevices } from 'react-native-vision-camera';
import { ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from './HomeNavigator';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Reanimated, { useAnimatedProps, useSharedValue, withSpring, createAnimatedPropAdapter } from 'react-native-reanimated';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Camera'>;

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const CameraView = () => {
  const navigation = useNavigation<NavigationProp>();
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const zoom = useSharedValue(0);

  const [showCamera, setShowCamera] = useState(true);
  const [imageSource, setImageSource] = useState('');

  const onRandomZoomPress = useCallback(() => {
    zoom.value = withSpring(Math.random());
  }, []);

  const animatedProps = useAnimatedProps<Partial<CameraProps>>(() => ({ zoom: zoom.value }), [zoom]);

  useEffect(() => {
    console.log(devices);
    async function getPermission() {
      const newCameraPermission = await Camera.requestCameraPermission();
      console.log(newCameraPermission);
    }
    getPermission();
  }, []);

  const capturePhoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({ qualityPrioritization: 'quality', skipMetadata: true });
      CameraRoll.save(photo.path);
      console.log(photo.path);
    }
  };

  if (device == null) {
    return (
      <View className='h-full flex flex-col justify-center'>
        <ActivityIndicator size={20} color={'red'} />
      </View>
    );
  }

  return (
    <View className='absolute top-0 left-0 h-screen w-screen'>
      <TouchableOpacity
        className='z-10 absolute top-20 left-10 w-12 h-12 rounded-full bg-white flex flex-row items-center justify-center'
        onPress={() => {
          navigation.goBack();
        }}>
        <Ionicons name='close' size={35} />
      </TouchableOpacity>
      {showCamera && (
        <>
          <ReanimatedCamera
            animatedProps={animatedProps}
            className='h-full w-full'
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            photo={true}
            video={true}
            audio={true}
            enableHighQualityPhotos
            enableZoomGesture
          />

          <View className='absolute bottom-20 left-0 flex flex-row justify-center items-center w-full'>
            <TouchableOpacity className='w-24 h-24 rounded-full bg-red-500 border-[8px] border-[#ffe8e8]' onPress={() => capturePhoto()} />
          </View>
        </>
      )}
      <>
        {imageSource && (
          <Image source={{ uri: 'file://' + imageSource }} className={'h-full w-full transition-opacity ' + (imageSource ? 'opacity-100' : 'opacity-0')} />
        )}
        {!showCamera && (
          <View className='absolute bottom-20 left-0 flex flex-row justify-center items-center w-full'>
            <TouchableOpacity
              className='w-24 h-24 rounded-full bg-white border-[8px] border-[#ffcaca] flex flex-row items-center justify-center'
              onPress={() => {
                setShowCamera(true);
                setImageSource('');
              }}>
              <Ionicons name='close' size={50} />
            </TouchableOpacity>
          </View>
        )}
      </>
    </View>
  );
};

export default CameraView;
