import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Image, NativeSyntheticEvent, SafeAreaView, View } from 'react-native';
import ContextMenu, { ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';
import ImagePicker, { Image as ImageType } from 'react-native-image-crop-picker';
import { PressableOpacity } from 'react-native-pressable-opacity';
import Text from '../../components/Text';
import { Ionicon } from '../../utils/Icons';
import { HomeStackParamList } from './HomeNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'PostPage'>;

interface FormData {
  media?: ImageType | null | undefined;
  description: string;
}

const PostPage = ({ navigation }: Props) => {
  const [formData, setFormData] = useState<FormData>({ description: '', media: undefined });

  const handleMediaContextOnPress = useCallback(async (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    if (e.nativeEvent.index === 0) {
      ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        mediaType: 'photo',
        compressImageMaxHeight: 500,
        compressImageMaxWidth: 500,
      })
        .then((image) => {
          setFormData((prev) => {
            return { ...prev, media: image };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ImagePicker.openCamera({ width: 500, height: 500, cropping: true, mediaType: 'photo', compressImageMaxHeight: 500, compressImageMaxWidth: 500 })
        .then((image) => {
          setFormData((prev) => {
            return { ...prev, media: image };
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
              <Image className='flex w-full h-full rounded-3xl' source={{ uri: formData.media?.path }} />
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
