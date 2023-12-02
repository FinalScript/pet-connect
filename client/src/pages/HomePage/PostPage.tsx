import { useMutation } from '@apollo/client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, NativeSyntheticEvent, Pressable, StyleSheet, TextInput, TouchableHighlight, View } from 'react-native';
import ContextMenu, { ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';
import { Dropdown } from 'react-native-element-dropdown';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../../config/tailwind/colors';
import Text from '../../components/Text';
import { UploadToFirebaseResult, storageFolders, uploadToFirebase } from '../../firebase/firebaseStorage';
import { CREATE_POST } from '../../graphql/Post';
import { ADDING_POST_TO_FEED } from '../../redux/constants';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import { FontAwesome, Ionicon, MaterialIcons } from '../../utils/Icons';
import { options } from '../../utils/hapticFeedbackOptions';

interface FormData {
  media?: Asset | null | undefined;
  description: string;
  petId: string;
}

interface Props {
  closeModal: () => void;
}

const PostPage = ({ closeModal }: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const currentUserId = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const [submitPost] = useMutation(CREATE_POST);
  const [formData, setFormData] = useState<FormData>({ description: '', media: undefined, petId: '' });
  const [focus, setFocus] = useState({ description: false });

  const petsListData = useMemo(() => {
    return pets.map((pet, i) => {
      return { value: pet.id, label: pet.name };
    });
  }, [pets]);

  useEffect(() => {
    pets[0] &&
      setFormData((prev) => {
        return { ...prev, petId: pets[0].id };
      });
  }, [pets]);

  const handlePost = useCallback(async () => {
    setLoading(true);

    if (!formData.media || !formData.petId) {
      trigger(HapticFeedbackTypes.notificationError, options);
      setLoading(false);
      return;
    }

    let mediaData: UploadToFirebaseResult;

    if (formData.media) {
      const uploadRes = await uploadToFirebase(formData.media, storageFolders.POSTS);

      if (uploadRes) {
        mediaData = uploadRes;
      }
    }

    setTimeout(() => {
      submitPost({ variables: { ...formData, media: mediaData } })
        .then(async ({ data }) => {
          if (data?.createPost.post) {
            dispatch({ type: ADDING_POST_TO_FEED, payload: data?.createPost.post });
            closeModal();
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err, null, 2));
        })
        .finally(() => {
          setLoading(false);
        });
    }, 200);
  }, [formData, dispatch, submitPost, currentUserId, setLoading, loading]);

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
      <View className='h-full w-full bg-themeBg'>
        <View className='px-5 flex-row items-center relative mt-10'>
          {/* <PressableOpacity className='p-4 -m-4' onPress={() => closeModal()} disabledOpacity={0.4}>
            <Ionicon name='ios-close' color='black' size={30} />
          </PressableOpacity> */}

          <Text className='-z-10 text-2xl font-bold absolute text-center w-full mx-5'>New Post</Text>
        </View>

        <KeyboardAwareScrollView className='mt-10 flex-1' extraHeight={200}>
          <View className='mx-5'>
            <ContextMenu
              dropdownMenuMode={true}
              actions={[
                { title: 'Photo Library', systemIcon: 'photo' },
                { title: 'Take Photo', systemIcon: 'camera' },
              ]}
              onPress={handleMediaContextOnPress}>
              <View className='bg-themeInput flex items-center justify-center rounded-3xl shadow-sm shadow-themeShadow aspect-square'>
                {formData.media ? (
                  <Image className='w-full h-full rounded-3xl' source={{ uri: formData.media?.uri }} />
                ) : (
                  <View className=' flex justify-center items-center p-10 rounded-3xl'>
                    <MaterialIcons name='photo-library' size={50} color={'#362013'} />
                    <Text className='text-themeText text-3xl mt-3'>Upload</Text>
                  </View>
                )}
              </View>
            </ContextMenu>
            <View className='mt-5'>
              <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Caption</Text>
              <TextInput
                className={
                  (focus.description ? 'border-themeActive' : 'border-transparent') +
                  ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow h-24 max-h-44 w-full rounded-3xl px-5 py-3 text-lg'
                }
                style={{ fontFamily: 'BalooChettan2-Regular' }}
                placeholderTextColor={'#444444bb'}
                value={formData.description}
                maxLength={100}
                numberOfLines={3}
                multiline={true}
                returnKeyType={'done'}
                blurOnSubmit={true}
                placeholder='Write a caption'
                onChangeText={handleDescriptionChange}
                onFocus={() => setFocus({ ...focus, description: true })}
                onBlur={() => setFocus({ ...focus, description: false })}
              />
            </View>
            <View className='mt-5'>
              <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Post as</Text>
              <PetsDropdown
                value={formData.petId}
                setValue={(val: string) =>
                  setFormData((prev) => {
                    return { ...prev, petId: val };
                  })
                }
                data={petsListData}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        <View className='mb-10 px-8 absolute bottom-0 w-full flex flex-row justify-between items-center'>
          <TouchableHighlight className='bg-themeBtn rounded-3xl shadow-sm shadow-themeShadow ml-auto' underlayColor={'#c59071'} onPress={handlePost}>
            <View className='px-6 py-1 flex flex-row justify-center items-center'>
              {loading && <ActivityIndicator className='mr-2 -ml-2' size='small' color={'#321411'} />}
              <Text className='text-xl font-semibold text-themeText'>Post</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </Pressable>
  );
};

const PetsDropdown = ({ value, setValue, data }: any) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View
      className={
        (isFocus ? 'border-themeActive' : 'border-transparent') + ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl text-lg'
      }>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField='label'
        valueField='value'
        placeholder={!isFocus ? 'Select pet to post as' : 'No pets found'}
        searchPlaceholder='Search...'
        value={value}
        itemTextStyle={{ fontFamily: 'BalooChettan2-Regular' }}
        placeholderStyle={{ fontFamily: 'BalooChettan2-Regular' }}
        selectedTextStyle={{ fontFamily: 'BalooChettan2-Regular' }}
        containerStyle={{ borderRadius: 24, marginBottom: 10, backgroundColor: colors.themeInput }}
        itemContainerStyle={{ borderRadius: 24 }}
        activeColor='transparent'
        dropdownPosition='top'
        autoScroll
        showsVerticalScrollIndicator
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    padding: 16,
  },
});

export default PostPage;
