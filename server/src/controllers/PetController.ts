import { PetUpdateDAO } from './../models/Pet';
import { Pet, PetCreationDAO } from '../models/Pet';

export const getPetById = async (id: string) => {
  const pet = await Pet.findOne({
    where: {
      id,
    },
  });

  return pet;
};

export const getPetByUsername = async (username: string) => {
  const pet = await Pet.findOne({
    where: {
      username,
    },
  });

  return pet;
};

export const createPet = async (data: PetCreationDAO) => {
  const newPet = await Pet.create(data);

  return newPet;
};

export const deletePet = async (id: string) => {
  await Pet.destroy({
    where: {
      id,
    },
    force: true,
  });

  return { message: 'Pet deleted' };
};

export const updatePet = async (id: string, data: PetUpdateDAO) => {
  const pet = Pet.update(data, { where: { id } });

  // Return the updated pet object
  return pet;
};
