import { ModalProps, View } from 'react-native';
import { Button } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { useDispatch } from 'react-redux';
import { DEVELOPER_PANEL_OPEN } from '../../redux/constants';
import Text from '../Text';
import Config from 'react-native-config';

interface Props extends ModalProps {
  logout: () => void;
  closeModal: () => void;
}

const SettingsModal = ({ logout, closeModal }: Props) => {
  const dispatch = useDispatch();

  return (
    <View className='flex w-full h-full px-5 py-5 bg-themeBg'>
      <Text className='text-3xl font-bold text-center'>Settings</Text>

      <View>
        <Button
          onPress={() => {
            closeModal();
            logout();
          }}
          title={'Log Out'}
        />
      </View>

      {Config.API_URL === 'development' && (
        <PressableOpacity
          activeOpacity={0.8}
          className='mt-5 bg-green-400 px-6 py-3 rounded-xl'
          onPress={() => {
            closeModal();

            setTimeout(() => {
              dispatch({ type: DEVELOPER_PANEL_OPEN, payload: true });
            }, 100);
          }}>
          <Text className='text-xl font-bold text-themeText text-center'>Open Developer Panel</Text>
        </PressableOpacity>
      )}
    </View>
  );
};

export default SettingsModal;
