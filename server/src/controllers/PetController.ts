import { Op, Sequelize } from 'sequelize';
import { Follows } from '../models/Follow';
import { Owner } from '../models/Owner';
import { Pet, PetCreationDAO } from '../models/Pet';
import { ProfilePicture } from '../models/ProfilePicture';
import { PetUpdateDAO } from './../models/Pet';

export const getFollowersByPetId = async (id: string) => {
  const pet = await Pet.findOne({
    where: {
      id,
    },
    include: [{ model: Owner, as: 'Followers', include: [{ model: ProfilePicture, as: 'ProfilePicture' }] }],
  });

  return pet.Followers;
};

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
    include: [
      {
        model: Owner,
        as: 'Owner',
      },
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
      },
      { model: Owner, as: 'Followers', attributes: [] },
    ],
  });

  return pet;
};

export const getPetsByOwnerId = async (id: string) => {
  const pets = await Pet.findAll({
    where: {
      ownerId: id,
    },
    include: [
      {
        model: Owner,
        as: 'Owner',
      },
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
      },
    ],
  });

  return pets;
};

export const getPetByUsername = async (username: string) => {
  const pet = await Pet.findOne({
    where: {
      username,
    },
    include: [
      {
        model: Owner,
        as: 'Owner',
      },
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
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
        model: Owner,
        as: 'Owner',
      },
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
      },
    ],
  });

  return pets;
};
