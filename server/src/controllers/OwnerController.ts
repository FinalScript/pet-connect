import { Op, Sequelize } from 'sequelize';
import { Owner, OwnerCreationDAO, OwnerUpdateDAO } from '../models/Owner';
import { Pet } from '../models/Pet';
import { ProfilePicture } from '../models/ProfilePicture';
import { Post } from '../models/Post';
import { redis } from '../db/redis';

export const getFollowingByOwnerId = async (id: string) => {
  const owner = await Owner.findOne({
    where: {
      id,
    },
    include: [{ model: Pet, as: 'FollowedPets', include: [{ model: ProfilePicture, as: 'ProfilePicture' }] }],
  });

  return owner.FollowedPets;
};

export const getOwner = async (authId: string, useCache = true) => {
  const cachedOwner = await redis.get(`owner:${authId}`);

  if (cachedOwner && useCache) {
    return JSON.parse(cachedOwner);
  } else {
    const owner = await Owner.findOne({
      where: {
        authId,
      },
      include: [
        {
          model: ProfilePicture,
          as: 'ProfilePicture',
        },
      ],
    });

    await redis.set(`owner:${authId}`, JSON.stringify(owner.dataValues), 'EX', 300);

    return owner;
  }
};

export const getOwnerById = async (id: string) => {
  const cachedOwner = await redis.get(`owner:${id}`);

  if (cachedOwner) {
    const owner: Owner = JSON.parse(cachedOwner);
    return owner;
  } else {
    const owner = await Owner.findOne({
      where: {
        id,
      },
      include: [
        {
          model: ProfilePicture,
          as: 'ProfilePicture',
        },
      ],
    });

    await redis.set(`owner:${id}`, JSON.stringify(owner.dataValues), 'EX', 300);

    return owner;
  }
};

export const getOwnerByUsername = async (username: string) => {
  const cachedOwner = await redis.get(`owner:${username}`);

  if (cachedOwner) {
    const owner: Owner = JSON.parse(cachedOwner);
    return owner;
  } else {
    const owner = await Owner.findOne({
      where: {
        username,
      },
      include: [
        {
          model: ProfilePicture,
          as: 'ProfilePicture',
        },
      ],
    });

    await redis.set(`owner:${username}`, JSON.stringify(owner.dataValues), 'EX', 300);

    return owner;
  }
};

export const createOwner = async ({ authId, username, name, location }: OwnerCreationDAO) => {
  const doesOwnerExist = await getOwner(authId);

  if (doesOwnerExist) {
    throw { status: 409, message: 'Duplicate Entry' };
  }

  const newOwner = await Owner.create({ authId, username, name, location });

  return newOwner;
};

export const updateOwner = async (authId: string, data: OwnerUpdateDAO) => {
  const owner = await getOwner(authId);

  await owner.update(data);
  await owner.reload();

  await redis.set(`owner:${authId}`, JSON.stringify(owner.dataValues), 'EX', 300);

  // Return the updated owner object
  return owner;
};

export const deleteOwner = async (authId: string) => {
  const owner = await getOwner(authId);

  await owner.destroy();

  return { message: 'Owner and pets deleted' };
};

export const searchForOwners = async (searchValue: string) => {
  const cachedOwners = await redis.get(`searchForOwners:${searchValue}`);

  if (cachedOwners) {
    const owners: Owner[] = JSON.parse(cachedOwners);
    return owners;
  } else {
    const owners = await Owner.findAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: '%' + searchValue + '%' } }, { username: { [Op.like]: '%' + searchValue + '%' } }],
      },
      limit: 20,
      include: [
        {
          model: ProfilePicture,
          as: 'ProfilePicture',
        },
      ],
    });

    await redis.set(`searchForOwners:${searchValue}`, JSON.stringify(owners), 'EX', 20);

    return owners;
  }
};
