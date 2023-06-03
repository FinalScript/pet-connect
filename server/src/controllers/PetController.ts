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

export const updatePet = async (id: string, { name, type, description, location }: PetCreationDAO) => {
  // Retrieve the pet by its ID
  const pet = await getPet(id);

  // Update the pet's fields with the provided values
  pet.name = name;
  pet.type = type;
  pet.description = description;
  pet.location = location;

  // Save the changes to the pet
  await pet.save();

  // Return the updated pet object
  return pet;
};
