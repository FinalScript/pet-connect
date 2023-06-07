import React, { useCallback, useState } from 'react';
import { View, Image, TouchableWithoutFeedback, TouchableOpacity, TextInput, Keyboard, TouchableHighlight, ActivityIndicator } from 'react-native';
import Text from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trigger, HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { options } from '../utils/hapticFeedbackOptions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import ImagePicker, { Image as ImageType } from 'react-native-image-crop-picker';
import { createPet, uploadProfilePic } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralReducer } from '../redux/reducers/generalReducer';
import { ADD_PET, CURRENT_USER, LOADING, PET_DATA } from '../redux/constants';
import { ProfileReducer } from '../redux/reducers/profileReducer';
import { btoa } from '../utils/btoa';
import { Buffer } from 'buffer';

const petTypes = [
  { type: 'Dog', img: require('../../assets/img/dog.png') },
  { type: 'Cat', img: require('../../assets/img/cat.png') },
  { type: 'Bird', img: require('../../assets/img/bird.png') },
  { type: 'Fish', img: require('../../assets/img/fish.png') },
  { type: 'Rabbit', img: require('../../assets/img/rabbit.png') },
  { type: 'Hamster', img: require('../../assets/img/hamster.png') },
  { type: 'Reptile', img: require('../../assets/img/reptile.png') },
  { type: 'Other', img: require('../../assets/img/other.png') },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Pet Creation'>;

interface FormData {
  type: string;
  name: string;
  description: string;
  profilePicture?: ImageType | null | undefined;
}

export default function PetCreation() {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const loading = useSelector((state: GeneralReducer) => state.general.loading);
  const navigation = useNavigation<NavigationProp>();
  const maxStep = 1;
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({ type: '', name: '', description: '', profilePicture: undefined });
  const [focus, setFocus] = useState({ name: false, description: false });
  const [optionsShuffle, setShuffle] = useState(0);

  const submit = useCallback(() => {
    dispatch({ type: LOADING, payload: true });

    setTimeout(() => {
      if (!formData.profilePicture?.data) {
        return;
      }
      createPet(formData)
        .then((res) => {
          if (res.status === 200) {
            dispatch({ type: ADD_PET, payload: res.data });
            dispatch({ type: CURRENT_USER, payload: { id: res.data.id, isPet: true } });
          }

          console.log(res.data);

          navigation.replace('Home');
        })
        .catch((err) => {
          console.log(err.response);
        })
        .finally(() => {
          dispatch({ type: LOADING, payload: false });
        });
    }, 1500);
  }, [formData, dispatch]);

  const petTypeOnPress = useCallback((type: string) => {
    setFormData((prev) => {
      return { ...prev, type: type.toUpperCase() };
    });
    trigger(HapticFeedbackTypes.effectClick, options);
  }, []);

  const moreOptionsOnPress = useCallback(() => {
    if (optionsShuffle + 4 >= petTypes.length) {
      setShuffle(0);
    } else {
      setShuffle((prev) => prev + 4);
    }

    setFormData((prev) => {
      return { ...prev, type: '' };
    });

    trigger(HapticFeedbackTypes.effectClick, options);
  }, [optionsShuffle]);

  const pickProfilePicture = useCallback(async () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
      compressImageMaxHeight: 500,
      compressImageMaxWidth: 500,
    })
      .then((image) => {
        setFormData((prev) => {
          return { ...prev, profilePicture: image };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const secondaryOnPress = useCallback(() => {
    trigger(HapticFeedbackTypes.impactMedium, options);
    if (step === 0) {
      dispatch({ type: CURRENT_USER, payload: { id: owner?.id, isPet: false } });
      navigation.replace('Home');
      return;
    }

    if (step <= maxStep) {
      setStep((prev) => prev - 1);
    }
  }, [step]);

  const nextOnPress = useCallback(() => {
    trigger(HapticFeedbackTypes.impactMedium, options);

    if (step === 0) {
      if (!formData.type) {
        return;
      }
    }

    if (step < maxStep) {
      setStep((prev) => prev + 1);
    }

    if (step === maxStep && formData.name) {
      submit();
    }
  }, [step, formData.type, formData.name]);

  const stepOne = () => {
    return (
      <View>
        <Text className='text-themeText font-semibold text-3xl'>Time to build your pet's profile! Start by selecting the pet type.</Text>

        <View className='mt-14 -mx-5 flex flex-wrap flex-row justify-center'>
          {petTypes.slice(optionsShuffle, optionsShuffle + 4).map((pet) => {
            return (
              <TouchableWithoutFeedback
                key={pet.type}
                onPress={() => {
                  petTypeOnPress(pet.type);
                }}>
                <View
                  className={
                    (formData.type.toUpperCase() === pet.type.toUpperCase() ? 'border-themeActive' : 'border-transparent') +
                    ' mb-5 mx-2.5 p-5 bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-40 h-40 rounded-3xl flex items-center'
                  }>
                  <Image className='flex w-full h-[75%] aspect-square opacity-70' source={pet.img} />
                  <Text className='mt-1 text-lg text-themeText'>{pet.type}</Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>

        <View className='mt-10 flex flex-row justify-center'>
          <TouchableOpacity onPress={moreOptionsOnPress}>
            <Text className='text-themeText text-lg p-2'>See more options...</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const stepTwo = () => {
    return (
      <View>
        <Text className='text-themeText font-semibold text-3xl'>We need some details about your pet!</Text>

        <View className='mt-5 px-2'>
          <View className='flex flex-col justify-center items-center'>
            <Text className='mb-2 text-xl font-bold text-themeText'>Profile Picture</Text>
            <TouchableHighlight
              className='w-[160px] h-[160px] bg-themeInput rounded-3xl shadow-sm shadow-themeShadow'
              underlayColor={'#d6cbcb'}
              onPress={pickProfilePicture}
              disabled={loading}>
              <View className=''>
                {formData.profilePicture ? (
                  <Image className='flex w-full h-full rounded-3xl' source={{ uri: formData.profilePicture?.path }} />
                ) : (
                  <View className='flex flex-row justify-center items-center h-full'>
                    <Icon name='plus-square-o' size={50} color={'#362013'} />
                  </View>
                )}
              </View>
            </TouchableHighlight>
          </View>
          <View className='mt-5'>
            <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Name *</Text>
            <TextInput
              className={
                (focus.name === true ? 'border-themeActive' : 'border-transparent') +
                ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-xl'
              }
              style={{ fontFamily: 'BalooChettan2-Regular' }}
              placeholderTextColor={'#444444bb'}
              value={formData.name}
              onChangeText={(e) => {
                setFormData((prev) => {
                  return { ...prev, name: e };
                });
              }}
              onFocus={() => {
                setFocus((prev) => {
                  return { ...prev, name: true };
                });
              }}
              onBlur={() => {
                setFocus((prev) => {
                  return { ...prev, name: false };
                });
              }}
              maxLength={30}
              returnKeyType='next'
              placeholder="Enter your pet's name"
              editable={!loading}
            />
          </View>
          <View className='mt-5'>
            <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Tell us about{formData.name ? ` ${formData.name}` : '...'}</Text>
            <TextInput
              className={
                (focus.description === true ? 'border-themeActive' : 'border-transparent') +
                ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow h-44 max-h-44 overflow-hidden w-full rounded-3xl px-5 py-3 text-xl'
              }
              style={{ fontFamily: 'BalooChettan2-Regular' }}
              placeholderTextColor={'#444444bb'}
              value={formData.description}
              onChangeText={(e) => {
                setFormData((prev) => {
                  return { ...prev, description: e };
                });
              }}
              onFocus={() => {
                setFocus((prev) => {
                  return { ...prev, description: true };
                });
              }}
              onBlur={() => {
                setFocus((prev) => {
                  return { ...prev, description: false };
                });
              }}
              maxLength={100}
              numberOfLines={4}
              multiline={true}
              returnKeyType={'done'}
              blurOnSubmit={true}
              placeholder='Write a nice description for your pet'
              editable={!loading}
            />
          </View>
        </View>
      </View>
    );
  };

  const getStep = () => {
    switch (step) {
      case 0:
        return stepOne();
      case 1:
        return stepTwo();
      default:
        break;
    }

    return <></>;
  };

  return (
    <SafeAreaView className='bg-themeBg h-full p-5 flex flex-col justify-between'>
      {getStep()}
      <View className='mb-2 mx-2 flex flex-row justify-between items-center'>
        <TouchableOpacity onPress={secondaryOnPress} activeOpacity={0.6} disabled={loading}>
          <View className='px-6 py-2 rounded-3xl'>
            <Text className='text-xl text-[#c07c4e]'>{step === 0 ? 'Skip' : 'Go Back'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableHighlight className='bg-themeBtn rounded-3xl shadow-sm shadow-themeShadow' underlayColor={'#c59071'} onPress={nextOnPress} disabled={loading}>
          <View className='px-6 py-1 flex flex-row justify-center items-center'>
            {loading && <ActivityIndicator className='mr-2 -ml-2' size='small' color={'#321411'} />}
            <Text className='text-xl font-semibold text-themeText'>{step === maxStep ? 'Submit' : 'Next'}</Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}
