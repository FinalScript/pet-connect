import { Pet, PetCreationDAO } from '../models/Pet';

export const getPet = async (id: string) => {
  const pet = await Pet.findOne({
    where: {
      id,
    },
  });

  return pet;
};

export const createPet = async ({ name, type, description, location }: PetCreationDAO) => {
  const newPet = await Pet.create({ name, type, description, location });

  return newPet;
};
