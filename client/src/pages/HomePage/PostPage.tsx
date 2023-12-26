import { useMutation } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { AntDesign, Ionicon, MaterialIcons } from '../../utils/Icons';
import { options } from '../../utils/hapticFeedbackOptions';
import { themeConfig } from '../../utils/theme';
import ImageCropPicker, { Image as ImageCropperType } from 'react-native-image-crop-picker';
interface FormData {
  media?: ImageCropperType | null | undefined;
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
  const maxStep = 1;
  const [step, setStep] = useState(0);

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

  const selectFromLibrary = useCallback(async () => {
    const selectedImage = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (!selectedImage.assets?.[0].uri) {
      return;
    }

    setTimeout(() => {
      ImageCropPicker.openCropper({
        path: selectedImage.assets?.[0].uri,
        mediaType: 'photo',
        width: 430,
        height: 623,
        cropping: true,
        writeTempFile: false,
      })
        .then((croppedImage) => {
          console.log(croppedImage); // Log the cropped image details
          setFormData((prev) => {
            return { ...prev, media: croppedImage };
          });
        })
        .catch((cropError) => {
          console.log(cropError); // Log any errors that occur when trying to open the cropper
        });
    }, 600);
  }, []);

  const selectFromCamera = useCallback(async () => {
    const capturedImage = await launchCamera({ mediaType: 'photo' });

    if (!capturedImage.assets?.[0].uri) {
      return;
    }

    setTimeout(() => {
      ImageCropPicker.openCropper({
        path: capturedImage.assets?.[0].uri,
        mediaType: 'photo',
        width: 430,
        height: 623,
        cropping: true,

        writeTempFile: false,
      })
        .then((croppedImage) => {
          console.log(croppedImage); // Log the cropped image details
          setFormData((prev) => {
            return { ...prev, media: croppedImage };
          });
        })
        .catch((cropError) => {
          console.log(cropError); // Log any errors that occur when trying to open the cropper
        });
    }, 600);
  }, []);

  const secondaryOnPress = useCallback(() => {
    trigger(HapticFeedbackTypes.impactMedium, options);
    if (step === 0) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      return;
    }

    if (step <= maxStep) {
      setStep((prev) => prev - 1);
    }
  }, [step, dispatch, navigation]);

  const nextOnPress = useCallback(() => {
    if (step === 0) {
      if (!formData.media) {
        return;
      }
    }

    if (step < maxStep) {
      setStep((prev) => prev + 1);
    }

    if (step === maxStep) {
      handlePost();
    }
  }, [step, formData, dispatch, handlePost]);

  const stepOne = useCallback(() => {
    return (
      <View className='mx-5'>
        <View
          className={
            'flex items-center justify-center rounded-3xl border-2 border-dashed aspect-[.69] ' + (formData.media ? 'border-transparent' : 'border-themeText')
          }>
          {formData.media ? (
            <Image className='w-full h-full rounded-3xl' source={{ uri: formData.media?.path }} />
          ) : (
            <View className=' flex justify-center items-center p-10 rounded-3xl'>
              <MaterialIcons name='photo-library' size={50} color={'#362013'} />
              <Text className='text-themeText text-3xl mt-3'>Preview</Text>
            </View>
          )}
        </View>

        <View className='flex items-center mt-10'>
          <Pressable onPress={selectFromLibrary} className='mb-2 flex-row items-center border-2 border-themeText rounded-full px-4'>
            <Ionicon name='image' size={20} />
            <Text className='text-themeText text-lg ml-2'>Select from Photos</Text>
          </Pressable>
          <Text>or</Text>
          <Pressable onPress={selectFromCamera} className='mt-2 flex-row items-center border-2 border-themeText rounded-full px-4'>
            <Ionicon name='camera' size={20} />
            <Text className='text-themeText text-lg ml-2'>Open Camera</Text>
          </Pressable>
        </View>
      </View>
    );
  }, [formData.media]);

  const stepTwo = useCallback(() => {
    return (
      <KeyboardAwareScrollView className='mt-5 flex-1' extraHeight={200}>
        <View className='mx-5'>
          <Text className='mb-2 pl-4 text-lg font-bold text-themeText'>Caption</Text>
          <TextInput
            className={
              (focus.description ? 'border-themeActive' : 'border-transparent') +
              ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow h-24 max-h-44 w-full rounded-3xl px-5 py-3 text-lg'
            }
            style={{ fontFamily: 'BalooChettan2-Regular' }}
            placeholderTextColor={'#444444bb'}
            value={formData.description}
            maxLength={200}
            numberOfLines={3}
            multiline={true}
            returnKeyType={'done'}
            blurOnSubmit={true}
            placeholder='Write a caption'
            onChangeText={handleDescriptionChange}
            onFocus={() => setFocus({ ...focus, description: true })}
            onBlur={() => setFocus({ ...focus, description: false })}
          />

          <View className='mt-5 pb-2'>
            <Text className='mb-2 pl-4 text-lg font-bold text-themeText'>Post as</Text>
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
    );
  }, [focus, formData, petsListData, handleDescriptionChange, handlePost, PetsDropdown]);

  const getStep = useCallback(() => {
    switch (step) {
      case 0:
        return stepOne();
      case 1:
        return stepTwo();
      default:
        break;
    }

    return <></>;
  }, [step, stepOne, stepTwo]);

  return (
    <SafeAreaView className='bg-themeBg h-full p-5 flex-col relative'>
      <KeyboardAwareScrollView enableAutomaticScroll enableOnAndroid extraHeight={100}>
        {getStep()}
      </KeyboardAwareScrollView>

      <View className='mb-10 absolute bottom-0 w-full pr-5'>
        <View className='flex-row justify-between items-center w-full'>
          {step > 0 ? (
            <TouchableOpacity onPress={secondaryOnPress} activeOpacity={0.6} disabled={loading}>
              <View className='px-6 py-2 rounded-3xl'>
                <Text className='text-xl text-[#c07c4e]'>{'Go Back'}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View></View>
          )}

          <TouchableHighlight
            className='bg-themeBtn rounded-3xl shadow-sm shadow-themeShadow'
            underlayColor={'#c59071'}
            onPress={nextOnPress}
            disabled={loading}>
            <View className='px-6 py-1 flex flex-row justify-center items-center'>
              {loading && <ActivityIndicator className='mr-2 -ml-2' size='small' color={'#321411'} />}
              <Text className='text-xl font-semibold text-themeText'>{step === maxStep ? 'Submit' : 'Next'}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

const PetsDropdown = ({ value, setValue, data }: any) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View
      className={
        (isFocus ? 'border-themeActive rounded-3xl rounded-b-none' : 'border-transparent rounded-3xl') +
        ' bg-themeInput border-[5px] border-b-[0px] shadow-sm shadow-themeShadow w-full text-lg'
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
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          marginLeft: -5,
          marginRight: -5,
          backgroundColor: themeConfig.customColors.themeInput,
          borderTopWidth: 0,
          borderWidth: 5,
          borderColor: themeConfig.customColors.themeActive,
          shadowRadius: 0,
          shadowOpacity: 0,
        }}
        itemContainerStyle={{}}
        activeColor='transparent'
        dropdownPosition='bottom'
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
    padding: 16,
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
