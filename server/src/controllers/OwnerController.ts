import { Op } from 'sequelize';
import { Owner, OwnerCreationDAO, OwnerUpdateDAO } from '../models/Owner';

export const getOwnerByAuthId = async (authId: string) => {
  const owner = await Owner.findOne({
    where: {
      authId,
    },
  });

  return owner;
};

export const getOwnerById = async (id: string) => {
  const owner = await Owner.findOne({
    where: {
      id,
    },
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
  const doesOwnerExist = await getOwnerByAuthId(authId);

  if (doesOwnerExist) {
    throw { status: 409, message: 'Duplicate Entry' };
  }

  const newOwner = await Owner.create({ authId, username, name, location });

  return newOwner;
};

export const updateOwner = async (authId: string, data: OwnerUpdateDAO) => {
  const owner = await getOwnerByAuthId(authId);

  await owner.update(data);
  await owner.reload();

  return owner;
};

export const deleteOwner = async (authId: string) => {
  const owner = await getOwnerByAuthId(authId);

  await owner.destroy();

  return { message: 'Owner and pets deleted' };
};

export const searchForOwners = async (searchValue: string) => {
  const owners = await Owner.findAll({
    where: {
      [Op.or]: [{ name: { [Op.like]: '%' + searchValue + '%' } }, { username: { [Op.like]: '%' + searchValue + '%' } }],
    },
    limit: 20,
  });

  return owners;
};
