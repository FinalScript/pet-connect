import { useLazyQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../../App';
import { Owner, Pet } from '../../__generated__/graphql';
import Image from '../../components/Image';
import PetTypeImage from '../../components/PetTypeImage';
import Text from '../../components/Text';
import { SEARCH } from '../../graphql/Search';
import { Feather, Ionicon } from '../../utils/Icons';
import { useSelector } from 'react-redux';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import { themeConfig } from '../../utils/theme';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home', undefined>;
}

const Explore = ({ navigation }: Props) => {
  const ownerId = useSelector((state: ProfileReducer) => state.profile.owner?.id);
  const [executeSearch] = useLazyQuery(SEARCH);
  const [formData, setFormData] = useState({ search: '' });
  const [focus, setFocus] = useState({ search: false });
  const [searchResultsPets, setSearchResultsPets] = useState<Pet[]>([]);
  const [searchResultsOwners, setSearchResultsOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Type in a keyword');

  useEffect(() => {
    setMessage('');
    setLoading(true);

    if (formData.search?.trim() === '') {
      setMessage('Type in a keyword');
      setSearchResultsOwners([]);
      setSearchResultsPets([]);
      setLoading(false);
      return;
    }

    // make delayed requests everytime search or filter parameters are changed
    const delayDebounceFn = setTimeout(async () => {
      const results = await executeSearch({ variables: { search: formData.search.trim() } });

      if (results.data?.search.results) {
        const data = results.data?.search.results;

        setSearchResultsOwners(data.owners);
        setSearchResultsPets(data.pets);

        if (data.owners.length === 0 && data.pets.length === 0) {
          setMessage('No results found');
        }
      }

      setLoading(false);
    }, 550);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.search]);

  return (
    <SafeAreaView className='flex-1 h-full items-center bg-themeBg'>
      <View className='mt-3 w-full flex-row items-center px-5 relative'>
        <View className='absolute px-5 ml-5 z-10'>
          <Ionicon name='search' size={25} color={themeConfig.customColors.themeText} />
        </View>
        <TextInput
          className={
            (focus.search === true ? 'border-themeActive' : 'border-transparent') +
            ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 pl-14 text-lg'
          }
          style={{ fontFamily: 'BalooChettan2-Regular' }}
          placeholderTextColor={'#444444bb'}
          value={formData.search}
          onChangeText={(e) => {
            setFormData((prev) => {
              return { ...prev, search: e };
            });
          }}
          onFocus={() => {
            setFocus((prev) => {
              return { ...prev, search: true };
            });
          }}
          onBlur={() => {
            setFocus((prev) => {
              return { ...prev, search: false };
            });
          }}
          maxLength={100}
          returnKeyType={'search'}
          blurOnSubmit={true}
          placeholder='Search'
          scrollEnabled={false}
        />
        {formData.search && (
          <Pressable
            onPress={() => {
              setFormData((prev) => {
                return { ...prev, search: '' };
              });
            }}
            className='pr-5 mr-5 absolute right-0'>
            <Feather name='x' size={15} color={themeConfig.customColors.themeText} />
          </Pressable>
        )}
      </View>

      <ScrollView className='w-full px-5 pt-2.5 mt-2.5'>
        {loading && <ActivityIndicator className='my-5' size='small' color={'#321411'} />}
        {message && <Text className='text-center'>{message}</Text>}

        {searchResultsOwners.length > 0 && <Text className='text-center'>Owners</Text>}

        {searchResultsOwners.map((result) => {
          return (
            <View key={result.id} className='flex-row items-center mt-5'>
              <Pressable
                className={'h-[80px] flex flex-row flex-1 rounded-2xl bg-themeInput shadow-sm shadow-themeShadow'}
                onPress={() => {
                  navigation.push('Owner Profile', { ownerId: result.id });
                }}>
                <View className='w-[80px] aspect-square flex justify-center items-center mr-5 p-1'>
                  {result?.ProfilePicture?.url ? (
                    <Image
                      className='w-full h-full rounded-xl'
                      source={{
                        uri: result.ProfilePicture.url,
                      }}
                    />
                  ) : (
                    <Ionicon name='person' size={50} style={{ opacity: 0.8 }} />
                  )}
                </View>
                <View className='flex justify-center'>
                  <Text className='text-2xl -mb-1'>{result?.name}</Text>
                  <Text className='text-sm'>@{result?.username}</Text>
                </View>

                {ownerId === result.id && (
                  <View className='flex-1 flex-row justify-end items-start px-3 py-2'>
                    <View className='bg-emerald-200 px-3 rounded-xl'>
                      <Text className='font-medium text-xs'>You</Text>
                    </View>
                  </View>
                )}
              </Pressable>
            </View>
          );
        })}

        {searchResultsPets.length > 0 && <Text className='mt-5 text-center'>Pets</Text>}

        {searchResultsPets.map((result) => {
          return (
            <View key={result.id} className='flex-row items-center mt-5'>
              <Pressable
                className={'h-[80px] flex flex-row flex-1 rounded-2xl bg-themeInput shadow-sm shadow-themeShadow'}
                onPress={() => {
                  navigation.push('Pet Profile', { petId: result.id });
                }}>
                <View className='w-[80px] aspect-square flex justify-center items-center mr-5 p-1'>
                  {result?.ProfilePicture?.url ? (
                    <Image
                      className='w-full h-full rounded-xl'
                      source={{
                        uri: result.ProfilePicture.url,
                      }}
                    />
                  ) : (
                    <PetTypeImage type={result.type} className='w-full h-full' />
                  )}
                </View>
                <View className='flex justify-center'>
                  <Text className='text-2xl -mb-1'>{result?.name}</Text>
                  <Text className='text-sm'>@{result?.username}</Text>
                </View>

                {ownerId === result.Owner?.id && (
                  <View className='flex-1 flex-row justify-end items-start px-3 py-2'>
                    <View className='bg-emerald-200 px-3 rounded-lg'>
                      <Text className='font-medium text-xs'>Your Pet</Text>
                    </View>
                  </View>
                )}
              </Pressable>
            </View>
          );
        })}

        <View className='h-24'></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;
