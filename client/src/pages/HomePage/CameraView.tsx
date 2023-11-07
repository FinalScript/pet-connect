import * as React from 'react';
import { useRef, useState, useMemo, useCallback } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, TapGestureHandler } from 'react-native-gesture-handler';
import { CameraDeviceFormat, CameraRuntimeError, PhotoFile, sortFormats, useCameraDevices, VideoFile } from 'react-native-vision-camera';
import { Camera, frameRateIncludedm } from 'react-native-vision-camera';
import { CONTENT_SPACING, MAX_ZOOM_FACTOR, SAFE_AREA_PADDING } from '../../utils/constants';
import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useIsForeground } from '../../hooks/useIsForeground';
import { StatusBarBlurBackground } from '../../components/StatusBarBlurBackground';
import { CaptureButton } from '../../components/CaptureButton';
import { PressableOpacity } from 'react-native-pressable-opacity';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import { HomeStackParamList } from './HomeNavigator';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Ionicon } from '../../utils/Icons';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Camera'>;

export function CameraView(): React.ReactElement {
  const navigation = useNavigation<NavigationProp>();
  const [recentImage, setRecentImage] = useState<string>();
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const zoom = useSharedValue(0);
  const isPressingButton = useSharedValue(false);
  const [isRecording, setIsRecording] = useState(false);

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableNightMode, setEnableNightMode] = useState(false);

  // camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const formats = useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  // //#region Memos
  // const [is60Fps, setIs60Fps] = useState(true);
  // const fps = useMemo(() => {
  //   if (!is60Fps) return 30;

  //   if (enableNightMode && !device?.supportsLowLightBoost) {
  //     // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
  //     return 30;
  //   }

  //   const supports60Fps = formats.some((f) => f.frameRateRanges.some((r) => frameRateIncluded(r, 60)));
  //   if (!supports60Fps) {
  //     // 60 FPS is not supported by any format.
  //     return 30;
  //   }
  //   // If nothing blocks us from using it, we default to 60 FPS.
  //   return 60;
  // }, [device?.supportsLowLightBoost, enableNightMode, formats, is60Fps]);

  const supportsCameraFlipping = useMemo(() => devices.back != null && devices.front != null, [devices.back, devices.front]);
  const supportsFlash = device?.hasFlash ?? false;
  const supports60Fps = useMemo(() => formats.some((f) => f.frameRateRanges.some((rate) => frameRateIncluded(rate, 60))), [formats]);
  const canToggleNightMode = enableNightMode
    ? true // it's enabled so you have to be able to turn it off again
    : device?.supportsLowLightBoost ?? false; // either we have native support, or we can lower the FPS
  //#endregion

  //#region Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton]
  );
  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);
  const onMediaCaptured = useCallback(
    (media: PhotoFile | VideoFile, type: 'photo' | 'video') => {
      console.log(`Media captured! ${JSON.stringify(media)}`);
    },
    [navigation]
  );
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'));
  }, []);
  //#endregion

  //#region Effects
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  useEffect(() => {
    CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos',
    })
      .then((r) => {
        if (r.edges[0].node.image.uri) {
          setRecentImage(r.edges[0].node.image.uri);
        }
      })
      .catch((err) => {
        console.log(err);
        //Error Loading Images
      });
  }, []);
  //#endregion

  //#region Tap Gesture
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  //#endregion

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
    },
  });
  //#endregion

  const selectFromLibrary = useCallback(() => {
    ImageCropPicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      mediaType: 'photo',
    })
      .then((image) => {
        console.log(image);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (device != null) {
  } else {
    console.log('re-rendering camera page without active camera');
  }

  return (
    <View style={styles.container}>
      {device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                hdr={false}
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                isActive={isActive}
                onInitialized={onInitialized}
                onError={onError}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                photo={true}
                video={true}
                audio={hasMicrophonePermission}
                orientation='portrait'
                enableHighQualityPhotos
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}

      <View style={styles.captureRow} className='w-full'>
        <View className='flex flex-row justify-center items-center'>
          <TouchableOpacity onPress={selectFromLibrary} className='flex-1'>
            <View className='px-2 py-2 flex flex-col justify-center items-center'>
              <View className='rounded-xl w-12 h-12 flex flex-row justify-center items-center'>
                {/* <Ionicon name='image' size={40} /> */}
                {recentImage ? (
                  <Image source={{ uri: recentImage }} className='flex w-full h-full aspect-square rounded-xl' />
                ) : (
                  <Ionicon name='image' color={'white'} size={40} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <CaptureButton
            camera={camera}
            onMediaCaptured={onMediaCaptured}
            cameraZoom={zoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            flash={supportsFlash ? flash : 'off'}
            enabled={isCameraInitialized && isActive}
            setIsPressingButton={setIsPressingButton}
            setIsRecording={setIsRecording}
          />
          <View className='flex-1'></View>
        </View>
      </View>

      <StatusBarBlurBackground />

      <View style={styles.leftButtonRow}>
        <PressableOpacity
          style={styles.button}
          onPress={() => {
            navigation.goBack();
          }}
          disabledOpacity={0.4}>
          <Ionicon name='ios-close' color='white' size={24} />
        </PressableOpacity>
      </View>

      <View style={styles.rightButtonRow}>
        {supportsCameraFlipping && (
          <PressableOpacity style={styles.button} onPress={onFlipCameraPressed} disabledOpacity={0.4}>
            <Ionicon name='camera-reverse' color='white' size={24} />
          </PressableOpacity>
        )}
        {supportsFlash && (
          <PressableOpacity style={styles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
            <Ionicon name={flash === 'on' ? 'flash' : 'flash-off'} color='white' size={24} />
          </PressableOpacity>
        )}
        {/* {supports60Fps && (
          <PressableOpacity style={styles.button} onPress={() => setIs60Fps(!is60Fps)}>
            <Text style={styles.text}>
              {is60Fps ? '60' : '30'}
              {'\n'}FPS
            </Text>
          </PressableOpacity>
        )} */}
        {canToggleNightMode && (
          <PressableOpacity style={styles.button} onPress={() => setEnableNightMode(!enableNightMode)} disabledOpacity={0.4}>
            <Ionicon name={enableNightMode ? 'moon' : 'moon-outline'} color='white' size={24} />
          </PressableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureRow: { position: 'absolute', alignSelf: 'center', bottom: SAFE_AREA_PADDING.paddingBottom + 20 },
  button: {
    marginBottom: CONTENT_SPACING,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  leftButtonRow: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
