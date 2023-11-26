import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, TextInput, View } from 'react-native';
import Text from '../components/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralReducer } from '../redux/reducers/generalReducer';
import { DEVELOPER_PANEL_OPEN } from '../redux/constants';

interface Props {
  apiUrl: { set: Dispatch<SetStateAction<string | undefined>>; value?: string };
}

export default function DeveloperPanel({ apiUrl }: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState({ apiUrl: false });
  const [formData, setFormData] = useState({ apiUrl: apiUrl.value });
  const developerPanelOpen = useSelector((state: GeneralReducer) => state.general.developerPanelOpen);

  const hasChanged = useMemo(() => {
    return apiUrl.value !== formData.apiUrl;
  }, [apiUrl.value, formData]);

  const onSubmit = useCallback(async () => {
    if (!formData.apiUrl || !hasChanged) {
      dispatch({ type: DEVELOPER_PANEL_OPEN, payload: false });
      return;
    }

    await AsyncStorage.setItem('@API_URL', formData.apiUrl);
    apiUrl.set(formData.apiUrl);
    dispatch({ type: DEVELOPER_PANEL_OPEN, payload: false });
  }, [formData, apiUrl]);

  return (
    <Modal
      style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      visible={developerPanelOpen}
      presentationStyle='pageSheet'
      animationType='slide'
      onRequestClose={() => {
        dispatch({ type: DEVELOPER_PANEL_OPEN, payload: false });
      }}>
      <View className='flex w-full h-full px-2 py-5 bg-themeBg'>
        <View className='flex-row justify-between -mx-2 -mt-5'>
          <Pressable
            disabled={loading}
            onPress={() => {
              dispatch({ type: DEVELOPER_PANEL_OPEN, payload: false });
            }}>
            <Text className='text-xl py-5 px-5'>Cancel</Text>
          </Pressable>
          <Text className='text-xl font-bold pt-5'>Developer Panel</Text>
          <Pressable disabled={loading} onPress={onSubmit} className='flex-row items-center py-5 px-5'>
            {loading && <ActivityIndicator className='mr-2.5' size='small' color={'#321411'} />}

            <Text className='text-xl text-blue-500'>{hasChanged ? 'Save' : 'Done'}</Text>
          </Pressable>
        </View>

        <View className='mt-5'>
          <Text className='mb-2 pl-4 text-lg font-bold text-themeText'>API_URL</Text>
          <TextInput
            className={
              (focus.apiUrl === true ? 'border-themeActive' : 'border-transparent') +
              ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-lg'
            }
            style={{ fontFamily: 'BalooChettan2-Regular' }}
            placeholderTextColor={'#444444bb'}
            value={formData.apiUrl}
            onChangeText={(e: any) => {
              setFormData((prev) => {
                return { ...prev, apiUrl: e };
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
            autoCorrect={false}
            autoCapitalize='none'
            maxLength={30}
            returnKeyType='done'
            placeholder='Enter API_URL'
            editable={!loading}
          />
        </View>
      </View>
    </Modal>
  );
}
