import { Owner, OwnerCreationDAO } from '../models/Owner';
import { Pet } from '../models/Pet';

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
