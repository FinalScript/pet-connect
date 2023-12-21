import { Op, Sequelize } from 'sequelize';
import { Follows } from '../models/Follow';
import { Owner } from '../models/Owner';
import { Pet, PetCreationDAO } from '../models/Pet';
import { ProfilePicture } from '../models/ProfilePicture';
import { PetUpdateDAO } from './../models/Pet';
import { redis } from '../db/redis';

export const getFollowersByPetId = async (id: string) => {
  const cachedFollowers = await redis.get(`followersByPetId:${id}`);

  if (cachedFollowers) {
    const followers: Owner[] = JSON.parse(cachedFollowers);
    return followers;
  } else {
    const pet = await Pet.findOne({
      where: {
        id,
      },
      include: [{ model: Owner, as: 'Followers', include: [{ model: ProfilePicture, as: 'ProfilePicture' }] }],
    });

    await redis.set(`followersByPetId:${id}`, JSON.stringify(pet.Followers.map((user) => user.get({ plain: true }))), 'EX', 300);

    return pet.Followers;
  }
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
  const cachedPet = await redis.get(`pet:${id}`);

  if (cachedPet) {
    const pet: Pet = JSON.parse(cachedPet);
    return pet;
  } else {
    const pet = await Pet.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Owner,
          as: 'Owner',
          include: [{ model: ProfilePicture, as: 'ProfilePicture' }],
        },
        {
          model: ProfilePicture,
          as: 'ProfilePicture',
        },
      ],
    });

    await redis.set(`pet:${id}`, JSON.stringify(pet.dataValues), 'EX', 300);

    return pet;
  }
};

export const getPetsByOwnerId = async (id: string) => {
  const cachedPets = await redis.get(`getPetsByOwnerId:${id}`);

  if (cachedPets) {
    const pets: Pet[] = JSON.parse(cachedPets);
    return pets;
  } else {
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

    await redis.set(`getPetsByOwnerId:${id}`, JSON.stringify(pets.map((user) => user.get({ plain: true }))), 'EX', 30);

    return pets;
  }
};

export const getPetByUsername = async (username: string) => {
  const cachedPet = await redis.get(`pet:${username}`);

  if (cachedPet) {
    const pet: Pet = JSON.parse(cachedPet);
    return pet;
  } else {
    const pet = await Pet.findOne({
      where: {
        username,
      },
      include: [
        {
          model: Owner,
          as: 'Owner',
          include: [{ model: ProfilePicture, as: 'ProfilePicture' }],
        },
        {
          model: ProfilePicture,
          as: 'ProfilePicture',
        },
      ],
    });

    await redis.set(`pet:${username}`, JSON.stringify(pet.dataValues), 'EX', 300);

    return pet;
  }
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

  await redis.set(`pet:${id}`, JSON.stringify(pet.dataValues), 'EX', 300);

  // Return the updated pet object
  return pet;
};

export const searchForPets = async (searchValue: string) => {
  const cachedPets = await redis.get(`searchForPets:${searchValue}`);

  if (cachedPets) {
    const pets: Pet[] = JSON.parse(cachedPets);
    return pets;
  } else {
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

    await redis.set(`searchForPets:${searchValue}`, JSON.stringify(pets), 'EX', 20);

    return pets;
  }
};
