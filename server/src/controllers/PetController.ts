import { PetUpdateDAO } from './../models/Pet';
import { Pet, PetCreationDAO } from '../models/Pet';
import { ProfilePicture } from '../models/ProfilePicture';
import { Op } from 'sequelize';
import { Owner } from '../models/Owner';

export const getPetById = async (id: string) => {
  const pet = await Pet.findOne({
    where: {
      id,
    },
    include: [
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
      },
      {
        model: Owner,
        as: 'Owner',
      },
    ],
  });

  return pet;
};

export const getPetByUsername = async (username: string) => {
  const pet = await Pet.findOne({
    where: {
      username,
    },
    include: [
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
      },
      {
        model: Owner,
        as: 'Owner',
      },
    ],
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
  const pet = await Pet.update(data, { where: { id } });

  // Return the updated pet object
  return pet;
};

export const searchForPets = async (searchValue: string) => {
  const pets = await Pet.findAll({
    where: {
      [Op.or]: [{ name: { [Op.like]: '%' + searchValue + '%' } }, { username: { [Op.like]: '%' + searchValue + '%' } }],
    },
    limit: 20,
    include: [
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
      },
      {
        model: Owner,
        as: 'Owner',
      },
    ],
  });

  return pets;
};
