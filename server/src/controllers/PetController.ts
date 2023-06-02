import { Pet, PetCreationDAO } from '../models/Pet';

export const createPet = async ({ name, type, description, location }: PetCreationDAO) => {

  const newPet = await Pet.create({ name, type, description, location });

  return newPet;
};
