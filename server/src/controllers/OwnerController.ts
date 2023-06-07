import { Owner, OwnerCreationDAO, OwnerUpdateDAO } from '../models/Owner';
import { OwnerPets } from '../models/OwnerPets';
import { Pet } from '../models/Pet';
import { Op } from 'sequelize';

export const getOwner = async (authId: string) => {
  const owner = await Owner.findOne({
    where: {
      authId,
    },
    include: { model: Pet },
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
  const owner = await Owner.findOne({
    where: {
      authId,
    },
  });

  const ownerPets = await OwnerPets.findAll({
    where: {
      ownerId: owner.id,
    },
  });

  const petIds = ownerPets.map((ownerPet: any) => ownerPet.petId);

  await Pet.destroy({
    where: {
      id: {
        [Op.in]: petIds,
      },
    },
    force: true,
  });

  await OwnerPets.destroy({
    where: {
      ownerId: owner.id,
    },
    force: true,
  });

  await Owner.destroy({
    where: {
      authId,
    },
    force: true,
  });

  return { message: 'Owner and pets deleted' };
};