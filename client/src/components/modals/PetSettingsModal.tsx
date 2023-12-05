import { ModalProps, View } from 'react-native';
import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { useDispatch } from 'react-redux';
import { DELETE_PET } from '../../graphql/Pet';
import { REMOVE_PET } from '../../redux/constants';
import Text from '../Text';
import { Pet } from '../../__generated__/graphql';

interface Props extends ModalProps {
  closeModal: () => void;
  pet: Pet;
}

const PetSettingsModal = ({ closeModal, pet }: Props) => {
  const dispatch = useDispatch();
  const [deletePet] = useMutation(DELETE_PET);

  const handleDeletePet = useCallback(() => {
    if (!pet.id) return;

    deletePet({ variables: { deletePetId: pet.id } })
      .then(({ data }) => {
        if (data?.deletePet) {
          dispatch({ type: REMOVE_PET, payload: pet.id });
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err, null, 2));
      });
  }, []);

  return (
    <View className='flex w-full h-full px-5 py-5 bg-themeBg'>
      <Text className='text-3xl font-bold text-center'>{pet.name}'s Settings</Text>

      {pet.id && (
        <PressableOpacity activeOpacity={0.8} className='mt-5 bg-red-400 px-6 py-3 rounded-xl' onPress={handleDeletePet}>
          <Text className='text-xl font-bold text-themeText text-center'>Delete {pet.name}</Text>
        </PressableOpacity>
      )}
    </View>
  );
};

export default PetSettingsModal;
