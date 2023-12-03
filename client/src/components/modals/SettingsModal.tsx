import { ModalProps, View } from 'react-native';
import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { Button } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE_PET } from '../../graphql/Pet';
import { CURRENT_USER, DEVELOPER_PANEL_OPEN, REMOVE_PET } from '../../redux/constants';
import { ProfileReducer } from '../../redux/reducers/profileReducer';
import Text from '../Text';

interface Props extends ModalProps {
  logout: () => void;
  closeModal: () => void;
}

const SettingsModal = ({ logout, closeModal }: Props) => {
  const dispatch = useDispatch();
  const owner = useSelector((state: ProfileReducer) => state.profile.owner);
  const currentUserId = useSelector((state: ProfileReducer) => state.profile.currentUser);
  const [deletePet] = useMutation(DELETE_PET);

  const handleDeletePet = useCallback(() => {
    if (!currentUserId?.id) return;

    deletePet({ variables: { deletePetId: currentUserId?.id } })
      .then(({ data }) => {
        if (data?.deletePet) {
          dispatch({ type: REMOVE_PET, payload: currentUserId.id });

          setTimeout(() => {
            dispatch({ type: CURRENT_USER, payload: { id: owner?.id, isPet: false } });
            closeModal();
          }, 500);
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err, null, 2));
      });
  }, []);

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

      {currentUserId?.isPet && (
        <PressableOpacity activeOpacity={0.8} className='mt-5 bg-red-400 px-6 py-3 rounded-xl' onPress={handleDeletePet}>
          <Text className='text-xl font-bold text-themeText text-center'>Delete Pet</Text>
        </PressableOpacity>
      )}

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
    </View>
  );
};

export default SettingsModal;
