import { Op } from 'sequelize';
import { Follows } from '../models/Follow';
import { Pet, PetCreationDAO } from '../models/Pet';
import { PetUpdateDAO } from './../models/Pet';

export const isFollowingPet = async (ownerId: string, petId: string) => {
  const isFollowing = await Follows.findOne({
    where: {
      ownerId: ownerId,
      petId: petId,
    },
  });

  return !!isFollowing; // Return true if the association exists, false otherwise
};

export const getPetById = async (id: string) => {
  const pet = await Pet.findOne({
    where: {
      id,
    },
  });

  return pet;
};

export const getPetsByOwnerId = async (id: string) => {
  const pets = await Pet.findAll({
    where: {
      ownerId: id,
    },
  });

  return pets;
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
  const pet = await getPetById(id);

  await pet.update(data);
  await pet.reload();

  // Return the updated pet object
  return pet;
};

export const searchForPets = async (searchValue: string) => {
  const pets = await Pet.findAll({
    where: {
      [Op.or]: [{ name: { [Op.like]: '%' + searchValue + '%' } }, { username: { [Op.like]: '%' + searchValue + '%' } }],
    },
    limit: 20,
  });

  return pets;
};
