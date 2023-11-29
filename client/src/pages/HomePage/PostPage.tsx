import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Image, NativeSyntheticEvent, Platform, SafeAreaView, View } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { AntDesign, Ionicon } from '../../utils/Icons';
import { HomeStackParamList } from './HomeNavigator';
import Text from '../../components/Text';
import ContextMenu, { ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadToFirebase } from '../../utils/firebaseStorage';

type Props = NativeStackScreenProps<HomeStackParamList, 'PostPage'>;

interface FormData {
  media?: Asset | null | undefined;
  description: string;
}

const PostPage = ({ navigation }: Props) => {
  const [formData, setFormData] = useState<FormData>({ description: '', media: undefined });

  const handleMediaContextOnPress = useCallback(async (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    if (e.nativeEvent.index === 0) {
      launchImageLibrary({
        mediaType: 'photo',
      })
        .then((image) => {
          if (image.assets && image.assets[0]) {
            uploadToFirebase(image.assets[0]);
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
          uploadToFirebase(image.assets[0]);
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
    <SafeAreaView className='h-full w-full bg-themeBg'>
      <View className='px-5 mb-5'>
        <PressableOpacity
          className='p-4 -m-4'
          onPress={() => {
            navigation.goBack();
          }}
          disabledOpacity={0.4}>
          <Ionicon name='ios-close' color='black' size={30} />
        </PressableOpacity>
      </View>
      <View className='mx-5'>
        <ContextMenu
          dropdownMenuMode={true}
          actions={[
            { title: 'Photo Library', systemIcon: 'photo' },
            { title: 'Take Photo', systemIcon: 'camera' },
          ]}
          onPress={handleMediaContextOnPress}>
          <View className='rounded-lg aspect-square'>
            {formData.media ? (
              <Image className='flex w-full h-full rounded-3xl' source={{ uri: formData.media?.uri }} />
            ) : (
              <View className='border-dashed border-[4px] border-themeText opacity-60 flex justify-center items-center h-full'>
                <View className='flex items-center gap-10'>
                  <Ionicon name='image' color='black' size={80} />
                  <Text className='text-themeText text-5xl'>Upload</Text>
                </View>
              </View>
            )}
          </View>
        </ContextMenu>
      </View>
    </SafeAreaView>
  );
};

export default PostPage;
