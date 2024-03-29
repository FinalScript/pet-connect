import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
import Text from '../components/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralReducer } from '../redux/reducers/generalReducer';
import { DEVELOPER_PANEL_OPEN } from '../redux/constants';
import { Notifications } from 'react-native-notifications';

interface Props {
  apiUrl: { set: Dispatch<SetStateAction<string | undefined>>; value?: string };
}

interface ApiUrlItem {
  id: string;
  apiUrl: string;
}

export default function DeveloperPanel({ apiUrl }: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ apiUrl: { protocol: '', url: '', port: '' } });
  const [apiUrlList, setApiUrlList] = useState<ApiUrlItem[]>([]);
  const developerPanelOpen = useSelector((state: GeneralReducer) => state.general.developerPanelOpen);

  useEffect(() => {
    const fetchApiUrlList = async () => {
      const storedApiUrlList = await AsyncStorage.getItem('@API_URL_LIST');
      if (storedApiUrlList) {
        setApiUrlList(JSON.parse(storedApiUrlList));
      }
    };

    fetchApiUrlList();
  }, []);

  useEffect(() => {
    const protocol = apiUrl.value?.split(':')[0].toString() || 'http';
    const url = apiUrl.value?.split(':')[1].toString().replace('//', '') || 'localhost';
    const port = apiUrl.value?.split(':')[2].toString() || '3000';

    setFormData((prev) => {
      return { ...prev, apiUrl: { protocol, url, port } };
    });
  }, [apiUrl]);

  const apiUrlValue = useMemo(() => {
    const { protocol, url, port } = formData.apiUrl;

    return protocol + '://' + url + ':' + port;
  }, [formData.apiUrl]);

  const hasChanged = useMemo(() => {
    return apiUrl.value !== apiUrlValue;
  }, [apiUrl.value, formData]);

  const onSubmit = useCallback(async () => {
    if (!formData.apiUrl || !hasChanged) {
      dispatch({ type: DEVELOPER_PANEL_OPEN, payload: false });
      return;
    }

    await AsyncStorage.setItem('@API_URL', apiUrlValue);
    apiUrl.set(apiUrlValue);
    dispatch({ type: DEVELOPER_PANEL_OPEN, payload: false });
  }, [formData, apiUrl]);

  const onAddApiUrl = useCallback(async () => {
    const newApiUrlItem: ApiUrlItem = {
      id: Date.now().toString(),
      apiUrl: apiUrlValue,
    };

    if (apiUrlList.find((item) => item.apiUrl === apiUrlValue)) return;

    const updatedApiUrlList = [...apiUrlList, newApiUrlItem];
    setApiUrlList(updatedApiUrlList);
    await AsyncStorage.setItem('@API_URL_LIST', JSON.stringify(updatedApiUrlList));
  }, [apiUrlValue, apiUrlList]);

  const onRemoveApiUrl = useCallback(
    async (id: string) => {
      const updatedApiUrlList = apiUrlList.filter((item) => item.id !== id);
      setApiUrlList(updatedApiUrlList);
      await AsyncStorage.setItem('@API_URL_LIST', JSON.stringify(updatedApiUrlList));
    },
    [apiUrlList]
  );

  const onApiUrlItemPress = useCallback(
    (apiUrl: string) => {
      const [protocol, url, port] = apiUrl.split(/:\/\/|:/);
      setFormData((prev) => {
        return { ...prev, apiUrl: { protocol, url, port } };
      });
    },
    [setFormData]
  );

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
          <View className='flex-row items-center'>
            <TextInput
              className={'bg-themeInput rounded-l-3xl px-5 pr-2 py-4 text-lg'}
              style={{ fontFamily: 'BalooChettan2-Regular' }}
              placeholderTextColor={'#444444bb'}
              value={formData.apiUrl.protocol}
              onChangeText={(e: any) => {
                setFormData((prev) => {
                  return { ...prev, apiUrl: { ...prev.apiUrl, protocol: e } };
                });
              }}
              autoCorrect={false}
              autoCapitalize='none'
              maxLength={6}
              returnKeyType='done'
              placeholder='Protocol'
              editable={!loading}
            />
            <View className='bg-themeInput h-full flex-row items-center border-r border-l border-themeShadow'>
              <Text className='text-lg text-gray-500 px-2'>://</Text>
            </View>
            <TextInput
              className={'bg-themeInput flex-1 px-5 py-4 text-lg'}
              style={{ fontFamily: 'BalooChettan2-Regular' }}
              placeholderTextColor={'#444444bb'}
              value={formData.apiUrl.url}
              onChangeText={(e: any) => {
                setFormData((prev) => {
                  return { ...prev, apiUrl: { ...prev.apiUrl, url: e } };
                });
              }}
              autoCorrect={false}
              autoCapitalize='none'
              maxLength={30}
              returnKeyType='done'
              placeholder='API_URL'
              editable={!loading}
            />
            <View className='bg-themeInput h-full flex-row items-center border-r border-l border-themeShadow'>
              <Text className='text-lg text-gray-500 px-2'>:</Text>
            </View>
            <TextInput
              className={'bg-themeInput px-5 py-4 text-lg rounded-r-lg'}
              style={{ fontFamily: 'BalooChettan2-Regular' }}
              placeholderTextColor={'#444444bb'}
              value={formData.apiUrl.port}
              onChangeText={(e: any) => {
                setFormData((prev) => {
                  return { ...prev, apiUrl: { ...prev.apiUrl, port: e } };
                });
              }}
              autoCorrect={false}
              autoCapitalize='none'
              maxLength={10}
              returnKeyType='done'
              placeholder='Port'
              editable={!loading}
            />
          </View>
        </View>

        <View className='mt-5'>
          <Text className='mb-2 pl-4 text-lg font-bold text-themeText'>API_URL List</Text>
          <FlatList
            data={apiUrlList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onApiUrlItemPress(item.apiUrl)} className='flex-row items-center py-2 px-4 border-b border-gray-300'>
                <Text className='flex-grow px-4'>{item.apiUrl}</Text>
                <TouchableOpacity onPress={() => onRemoveApiUrl(item.id)} className='px-2'>
                  <Text className='text-red-500'>Remove</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onAddApiUrl} className='flex-row items-center py-2 px-4 border-b border-gray-300'>
            <Text className='px-4 text-blue-500'>+ Add API_URL</Text>
          </TouchableOpacity>
        </View>
        <View>
        <Text className='mb-2 pl-4 mt-2 text-lg font-bold text-themeText'>Notifications</Text>
          <View className='flex-row mt-2 justify-center items-center'>
              <TouchableOpacity
                className='py-2 px-4 bg-blue-500 rounded-md mr-2'
                onPress={() =>
                  Notifications.ios.checkPermissions().then((currentPermissions) => {
                    console.log('Badges enabled: ' + !!currentPermissions.badge);
                    console.log('Sounds enabled: ' + !!currentPermissions.sound);
                    console.log('Alerts enabled: ' + !!currentPermissions.alert);
                    console.log('Car Play enabled: ' + !!currentPermissions.carPlay);
                    console.log('Critical Alerts enabled: ' + !!currentPermissions.criticalAlert);
                    console.log('Provisional enabled: ' + !!currentPermissions.provisional);
                    console.log('Provides App Notification Settings enabled: ' + !!currentPermissions.providesAppNotificationSettings);
                    console.log('Announcement enabled: ' + !!currentPermissions.announcement);
                  })
                }>
                <Text className='text-white'>Get notification permission</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='py-2 px-4 bg-blue-500 rounded-md'
                onPress={() =>
                  Notifications.postLocalNotification({
                    title: 'Test Notification',
                    body: 'This is a test notification',
                    identifier: '',
                    payload: undefined,
                    sound: '',
                    badge: 0,
                    type: '',
                    thread: '',
                  })
                }>
                <Text className='text-white'>Send notification</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </Modal>
  );
}
