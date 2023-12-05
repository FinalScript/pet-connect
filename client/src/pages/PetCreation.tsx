import { useMutation } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { HapticFeedbackTypes, trigger } from 'react-native-haptic-feedback';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { RootRouteProps, RootStackParamList } from '../../App';
import Image from '../components/Image';
import Text from '../components/Text';
import UsernameInput from '../components/UsernameInput';
import { UploadToFirebaseResult, storageFolders, uploadToFirebase } from '../firebase/firebaseStorage';
import { CREATE_PET } from '../graphql/Pet';
import { ADD_PET, CURRENT_USER, LOADING } from '../redux/constants';
import { GeneralReducer } from '../redux/reducers/generalReducer';
import { PetType, ProfileReducer } from '../redux/reducers/profileReducer';
import { options } from '../utils/hapticFeedbackOptions';

const petTypes = [
  { type: PetType.Dog, img: require('../../assets/img/dog.png') },
  { type: PetType.Cat, img: require('../../assets/img/cat.png') },
  { type: PetType.Bird, img: require('../../assets/img/bird.png') },
  { type: PetType.Fish, img: require('../../assets/img/fish.png') },
  { type: PetType.Rabbit, img: require('../../assets/img/rabbit.png') },
  { type: PetType.Hamster, img: require('../../assets/img/hamster.png') },
  { type: PetType.Snake, img: require('../../assets/img/snake.png') },
  { type: PetType.Other, img: require('../../assets/img/other.png') },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Pet Creation'>;

interface FormData {
  username: string;
  type: PetType;
  name: string;
  description: string;
  profilePicture?: Asset | null | undefined;
}

export default function PetCreation() {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const loading = useSelector((state: GeneralReducer) => state.general.loading);
  const [createPet] = useMutation(CREATE_PET);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RootRouteProps<'Pet Creation'>>();
  const maxStep = 1;
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({ type: PetType.Dog, username: '', name: '', description: '', profilePicture: undefined });
  const [focus, setFocus] = useState({ username: false, name: false, description: false });
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [optionsShuffle, setShuffle] = useState(0);

  const submit = useCallback(async () => {
    dispatch({ type: LOADING, payload: true });

    if (!(formData.username && isUsernameValid)) {
      trigger(HapticFeedbackTypes.notificationError, options);
      dispatch({ type: LOADING, payload: false });
      return;
    }

    let profilePictureData: UploadToFirebaseResult;

    if (formData.profilePicture) {
      const uploadRes = await uploadToFirebase(formData.profilePicture, storageFolders.PROFILE_PICTURES);

      if (uploadRes) {
        profilePictureData = uploadRes;
      }
    }

    setTimeout(() => {
      createPet({ variables: { ...formData, profilePicture: profilePictureData } })
        .then(async ({ data }) => {
          if (data?.createPet.pet) {
            dispatch({ type: ADD_PET, payload: data.createPet.pet });
            dispatch({ type: CURRENT_USER, payload: { id: data.createPet.pet.id, isPet: true } });
          }

          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.replace('Home');
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err, null, 2));
        })
        .finally(() => {
          dispatch({ type: LOADING, payload: false });
        });
    }, 500);
  }, [formData, dispatch, isUsernameValid]);

  const petTypeOnPress = useCallback((type: PetType) => {
    setFormData((prev) => {
      return { ...prev, type };
    });
    trigger(HapticFeedbackTypes.effectClick, options);
  }, []);

  const moreOptionsOnPress = useCallback(() => {
    if (optionsShuffle + 4 >= petTypes.length) {
      setShuffle(0);

      setFormData((prev) => {
        return { ...prev, type: PetType.Dog };
      });
    } else {
      setShuffle((prev) => prev + 4);

      setFormData((prev) => {
        return { ...prev, type: PetType.Rabbit };
      });
    }

    trigger(HapticFeedbackTypes.effectClick, options);
  }, [optionsShuffle]);

  const pickProfilePicture = useCallback(async () => {
    launchImageLibrary({
      mediaType: 'photo',
    })
      .then((res) => {
        setFormData((prev) => {
          return { ...prev, profilePicture: res.assets?.[0] };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const secondaryOnPress = useCallback(() => {
    trigger(HapticFeedbackTypes.impactMedium, options);
    if (step === 0) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        dispatch({ type: CURRENT_USER, payload: { id: owner?.id, isPet: false } });
        navigation.replace('Home');
      }
      return;
    }

    if (step <= maxStep) {
      setStep((prev) => prev - 1);
    }
  }, [step, dispatch]);

  const nextOnPress = useCallback(() => {
    trigger(HapticFeedbackTypes.impactMedium, options);

    if (step === 0) {
      if (!formData.type) {
        return;
      }
    }

    if (step === 2 && !isUsernameValid) {
      return;
    }

    if (step < maxStep) {
      setStep((prev) => prev + 1);
    }

    if (step === maxStep) {
      submit();
    }
  }, [step, formData, isUsernameValid, dispatch]);

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
                  <Text className='mt-1 text-lg text-themeText'>{pet.type.charAt(0) + pet.type.substring(1).toLowerCase()}</Text>
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
      <Pressable onPress={Keyboard.dismiss}>
        <View>
          <Text className='text-themeText font-semibold text-3xl'>We need some details about your pet!</Text>
          <View className='px-2 mt-3'>
            <View className='flex flex-col justify-center items-center'>
              <Text className='mb-2 text-xl font-bold text-themeText'>Profile Picture</Text>
              <TouchableHighlight
                className='w-[160px] h-[160px] bg-themeInput rounded-3xl shadow-sm shadow-themeShadow'
                underlayColor={'#d6cbcb'}
                onPress={pickProfilePicture}
                disabled={loading}>
                <View className=''>
                  {formData.profilePicture ? (
                    <Image className='flex w-full h-full rounded-3xl' source={{ uri: formData.profilePicture?.uri }} />
                  ) : (
                    <View className='flex flex-row justify-center items-center h-full'>
                      <Icon name='plus-square-o' size={50} color={'#362013'} />
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            </View>

            <View className='mt-5'>
              <View>
                <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>What is your pet's name?</Text>
                <TextInput
                  className={
                    (focus.name === true ? 'border-themeActive' : 'border-transparent') +
                    ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-lg'
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
              <View className='mt-3'>
                <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Give your pet a username.</Text>
                <UsernameInput
                  value={formData.username}
                  setValue={(e: string) => {
                    setFormData((prev) => {
                      return { ...prev, username: e };
                    });
                  }}
                  isValid={isUsernameValid}
                  setIsValid={setIsUsernameValid}
                  returnKeyType='next'
                  placeholder='Give your pet a unique username'
                  autoCapitalize='none'
                  autoCorrect={false}
                  editable={!loading}
                  prefix
                />
              </View>
              <View className='mt-3'>
                <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Tell us about{formData.name ? ` ${formData.name}` : '...'}</Text>
                <TextInput
                  className={
                    (focus.description === true ? 'border-themeActive' : 'border-transparent') +
                    ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow h-28 max-h-44 w-full rounded-3xl px-5 py-3 text-lg'
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
                  numberOfLines={3}
                  multiline={true}
                  returnKeyType={'done'}
                  blurOnSubmit={true}
                  placeholder='Write a nice description for your pet'
                  editable={!loading}
                  scrollEnabled={false}
                />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
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
    <SafeAreaView className='bg-themeBg h-full p-5 flex flex-col flew-grow'>
      <KeyboardAwareScrollView enableAutomaticScroll enableOnAndroid extraHeight={100}>
        {getStep()}
      </KeyboardAwareScrollView>

      <View className='mb-10 absolute bottom-0 w-full mx-2 flex flex-row justify-between items-center'>
        <TouchableOpacity onPress={secondaryOnPress} activeOpacity={0.6} disabled={loading}>
          <View className='px-6 py-2 rounded-3xl'>
            <Text className='text-xl text-[#c07c4e]'>{step === 0 ? (route?.params?.initial ? 'Skip' : 'Cancel') : 'Go Back'}</Text>
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
