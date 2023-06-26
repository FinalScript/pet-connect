import { Dimensions, ModalProps, View } from 'react-native';

import { Button } from 'react-native';
import Text from '../Text';

interface Props extends ModalProps {
  logout: () => void;
  closeModal: () => void;
}

const SettingsModal = ({ logout, closeModal }: Props) => {
  return (
    <View className='flex w-full h-full px-5 py-5'>
      <Text className='text-3xl font-bold'>Settings</Text>

      <View>
        <Button
          onPress={() => {
            closeModal();
            logout();
          }}
          title={'Log Out'}
        />
      </View>
    </View>
  );
};

export default SettingsModal;
