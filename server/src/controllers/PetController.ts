import { Op } from 'sequelize';
import { Pet, PetCreationDAO } from '../models/Pet';
import { PetUpdateDAO } from './../models/Pet';
import { Post } from '../models/Post';

export const getPetById = async (id: string) => {
  const pet = await Pet.findOne({
    where: {
      id,
    },
    include: [
      {
        all: true,
        nested: true,
      },
      { model: Post, as: 'Posts', include: [{ all: true, nested: true }] },
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
        all: true,
        nested: true,
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
        all: true,
        nested: true,
      },
    ],
  });

  return pets;
};
