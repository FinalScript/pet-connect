import { Owner, OwnerCreationDAO, OwnerUpdateDAO } from '../models/Owner';
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
