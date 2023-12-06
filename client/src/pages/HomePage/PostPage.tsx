import { useMutation } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Keyboard, NativeSyntheticEvent, Pressable, SafeAreaView, StyleSheet, TextInput, TouchableHighlight, View } from 'react-native';
import ContextMenu, { ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';
import { Dropdown } from 'react-native-element-dropdown';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import Image from '../../components/Image';
import Text from '../../components/Text';
import { UploadToFirebaseResult, storageFolders, uploadToFirebase } from '../../firebase/firebaseStorage';
import { CREATE_POST } from '../../graphql/Post';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import { AntDesign, MaterialIcons } from '../../utils/Icons';
import { options } from '../../utils/hapticFeedbackOptions';
import { themeConfig } from '../../utils/theme';
interface FormData {
  media?: Asset | null | undefined;
  description: string;
  petId: string;
}
type Props = NativeStackScreenProps<RootStackParamList, 'New Post'>;

const PostPage = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const pets = useSelector((state: ProfileReducer) => state.profile.pets);
  const currentUserId = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const [submitPost] = useMutation(CREATE_POST);
  const [formData, setFormData] = useState<FormData>({ description: '', media: undefined, petId: '' });
  const [focus, setFocus] = useState({ description: false });

  const petsListData = useMemo(() => {
    return pets.map((pet, i) => {
      return { value: pet.id, label: `@${pet.username} - ${pet.name}` };
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
            navigation.goBack();
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
      <SafeAreaView className='h-full w-full bg-themeBg'>
        <KeyboardAwareScrollView className='mt-5 flex-1' extraHeight={200}>
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
      </SafeAreaView>
    </Pressable>
  );
};

const PetsDropdown = ({ value, setValue, data }: any) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View
      className={
        (isFocus ? 'border-themeActive rounded-3xl rounded-t-none' : 'border-transparent rounded-3xl') +
        ' bg-themeInput border-[5px] border-t-[0px] shadow-sm shadow-themeShadow w-full text-lg'
      }>
      <Dropdown
        disable={data.length <= 1}
        style={styles.dropdown}
        data={data}
        labelField='label'
        valueField='value'
        placeholder={'Select pet to post as'}
        searchPlaceholder='Search...'
        value={value}
        renderItem={(item, selected) => {
          if (!selected) {
            return (
              <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
              </View>
            );
          }
        }}
        itemTextStyle={{ fontFamily: 'BalooChettan2-Regular', color: themeConfig.customColors.themeText }}
        placeholderStyle={{ fontFamily: 'BalooChettan2-Regular' }}
        selectedTextStyle={{ fontFamily: 'BalooChettan2-Regular', color: themeConfig.customColors.themeTrim }}
        containerStyle={{
          borderRadius: 24,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          marginBottom: 2,
          marginLeft: -5,
          marginRight: -5,
          backgroundColor: themeConfig.customColors.themeInput,
          borderBottomWidth: 0,
          borderWidth: 5,
          borderColor: themeConfig.customColors.themeActive,
          shadowRadius: 0,
          shadowOpacity: 0,
        }}
        itemContainerStyle={{}}
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
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default PostPage;
