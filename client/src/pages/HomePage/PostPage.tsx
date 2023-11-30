import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Image, Keyboard, NativeSyntheticEvent, Pressable, SafeAreaView, TextInput, TouchableHighlight, View } from 'react-native';
import ContextMenu, { ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PressableOpacity } from 'react-native-pressable-opacity';
import Text from '../../components/Text';
import { Ionicon } from '../../utils/Icons';
import { HomeStackParamList } from './HomeNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'PostPage'>;

interface FormData {
  media?: Asset | null | undefined;
  description: string;
}

const PostPage = ({ navigation }: Props) => {
  const [formData, setFormData] = useState<FormData>({ description: '', media: undefined });
  const [focus, setFocus] = useState({ description: false });

  const handlePost = () => {
    console.log('Post Submitted:', formData);
  };

  const handleDescriptionChange = (text: string) => {
    setFormData({ ...formData, description: text });
  };

  const handleMediaContextOnPress = useCallback(async (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    if (e.nativeEvent.index === 0) {
      launchImageLibrary({
        mediaType: 'photo',
      })
        .then((image) => {
          if (image.assets && image.assets[0]) {
            setFormData((prev) => {
              return { ...prev, media: image.assets?.[0] };
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      launchCamera({ mediaType: 'photo' })
        .then((image) => {
          if (!image.assets) {
            return;
          }
          setFormData((prev) => {
            return { ...prev, media: image.assets?.[0] };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <Pressable onPress={Keyboard.dismiss}>
      <SafeAreaView className='h-full w-full bg-themeBg'>
        <View className='px-5'>
          <PressableOpacity className='p-4 -m-4' onPress={() => navigation.goBack()} disabledOpacity={0.4}>
            <Ionicon name='ios-close' color='black' size={30} />
          </PressableOpacity>

          <Text className='text-5xl font-bold p-2 mb-5'>Create Post</Text>
        </View>

        <View className='mx-5 flex-1'>
          <ContextMenu
            dropdownMenuMode={true}
            actions={[
              { title: 'Photo Library', systemIcon: 'photo' },
              { title: 'Take Photo', systemIcon: 'camera' },
            ]}
            onPress={handleMediaContextOnPress}>
            <View className='rounded-lg aspect-square'>
              {formData.media ? (
                <Image className='w-full h-full rounded-3xl' source={{ uri: formData.media?.uri }} />
              ) : (
                <View className='border-dashed border-2 border-themeText opacity-60 flex justify-center items-center h-full'>
                  <Ionicon name='image' color='black' size={50} />
                  <Text className='text-themeText text-3xl'>Upload</Text>
                </View>
              )}
            </View>
          </ContextMenu>
          <View className='mt-3'>
            <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Description:</Text>
            <KeyboardAwareScrollView enableAutomaticScroll enableOnAndroid extraHeight={100}>
              <TextInput
                className={
                  (focus.description ? 'border-themeActive' : 'border-transparent') +
                  ' bg-themeInput border-[5px] shadow-sm h-28 shadow-themeShadow max-h-44 overflow-hidden w-full rounded-3xl px-5 py-3 text-lg'
                }
                style={{ fontFamily: 'BalooChettan2-Regular' }}
                placeholderTextColor={'#444444bb'}
                value={formData.description}
                maxLength={100}
                numberOfLines={3}
                multiline={true}
                returnKeyType={'done'}
                blurOnSubmit={true}
                placeholder='Write a description for your post'
                onChangeText={handleDescriptionChange}
                onFocus={() => setFocus({ ...focus, description: true })}
                onBlur={() => setFocus({ ...focus, description: false })}
              />
            </KeyboardAwareScrollView>
          </View>
        </View>
        <TouchableHighlight
          style={{ position: 'absolute', bottom: 20, right: 20 }}
          className='bg-themeBtn rounded-full shadow-sm shadow-themeShadow'
          underlayColor={'#c59071'}
          onPress={handlePost}>
          <View className='px-6 py-2 flex flex-row justify-center items-center'>
            <Text className='text-xl font-semibold text-themeText'>{'Post'}</Text>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    </Pressable>
  );
};

export default PostPage;
