import { Op, Sequelize } from 'sequelize';
import { Owner, OwnerCreationDAO, OwnerUpdateDAO } from '../models/Owner';
import { Pet } from '../models/Pet';
import { ProfilePicture } from '../models/ProfilePicture';

export const getOwner = async (authId: string) => {
  const owner = await Owner.findOne({
    where: {
      authId,
    },
    attributes: {
      include: [[Sequelize.literal('(SELECT COUNT(*) FROM Follows WHERE Follows.ownerId = Owner.id)'), 'followingCount'], '*'],
    },
    include: [
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
      },
    ],
    raw: true,
    nest: true,
  });

  return owner;
};

export const getOwnerById = async (id: string) => {
  const owner = await Owner.findOne({
    where: {
      id,
    },
    attributes: {
      include: [[Sequelize.literal('(SELECT COUNT(*) FROM Follows WHERE Follows.ownerId = Owner.id)'), 'followingCount'], '*'],
    },
    include: [
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
      },
    ],
    raw: true,
    nest: true,
  });

  return owner;
};

export const getOwnerByUsername = async (username: string) => {
  const owner = await Owner.findOne({
    where: {
      username,
    },
  });

  return owner;
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
  const owner = await Owner.update(data, { where: { authId } });

  // Return the updated owner object
  return owner;
};

export const deleteOwner = async (authId: string) => {
  const owner = await getOwner(authId);

  await owner.destroy();

  return { message: 'Owner and pets deleted' };
};

export const searchForOwners = async (searchValue: string) => {
  const owners = await Owner.findAll({
    where: {
      [Op.or]: [{ name: { [Op.like]: '%' + searchValue + '%' } }, { username: { [Op.like]: '%' + searchValue + '%' } }],
    },
    limit: 20,
    attributes: {
      include: [[Sequelize.literal('(SELECT COUNT(*) FROM Follows WHERE Follows.ownerId = Owner.id)'), 'followingCount'], '*'],
    },
    include: [
      {
        model: ProfilePicture,
        as: 'ProfilePicture',
      },
    ],
    raw: true,
    nest: true,
  });

  return owners;
};
