import { GraphQLError } from 'graphql';
import { getOwnerByAuthId } from '../../controllers/OwnerController';
import {
  createPet,
  deletePet,
  getFollowersByPetId,
  getPetById,
  getPetByUsername,
  getPetsByOwnerId,
  isFollowingPet,
  updatePet,
} from '../../controllers/PetController';
import { redis } from '../../db/redis';
import { isTokenValid } from '../../middleware/token';
import { Owner } from '../../models/Owner';
import { Pet } from '../../models/Pet';
import { ProfilePicture } from '../../models/ProfilePicture';

export const PetResolver = {
  Mutation: {
    createPet: async (_, { username, name, type, description, location, profilePicture }, context) => {
      const { token } = context;
      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const authId = jwtResult.id;

      const owner = await getOwnerByAuthId(authId);

      if (!owner) {
        throw new GraphQLError('Owner does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (username.match('[^a-zA-Z0-9._\\-]')) {
        throw new GraphQLError('Username Invalid', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (username.length > 30) {
        throw new GraphQLError('Username is too long (Max 30)', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (username.length < 2) {
        throw new GraphQLError('Username is too short (Min 2)', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (await getPetByUsername(username)) {
        throw new GraphQLError('Username taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!Pet.getAttributes().type.values.includes(type.toUpperCase())) {
        throw new GraphQLError('Incorrect type provided', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      type = type.toUpperCase();

      let newPet: Pet;

      try {
        newPet = await createPet({ name, type, description, location, username });

        if (profilePicture) {
          const profilePictureDAO = ProfilePicture.build(profilePicture);

          await newPet.setProfilePicture(profilePictureDAO);
          await newPet.save();
          await newPet.reload({
            include: [
              {
                model: ProfilePicture,
                as: 'ProfilePicture',
              },
              { model: Owner, attributes: ['id'], as: 'Owner' },
            ],
          });
        }
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }

      try {
        await owner.addPet(newPet);
        await owner.save();
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }

      return { pet: newPet };
    },

    updatePet: async (_, { id, username, name, type, description, location, profilePicture }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetById(id);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      if (type) {
        if (!Pet.getAttributes().type.values.includes(type.toUpperCase())) {
          throw new GraphQLError('Incorrect type provided', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          });
        }
        type = type.toUpperCase();
      }

      if (username) {
        if (username !== pet.username) {
          if (username.match('[^a-zA-Z0-9._\\-]')) {
            throw new GraphQLError('Username Invalid', {
              extensions: {
                code: 'BAD_USER_INPUT',
              },
            });
          }

          if (username.length > 30) {
            throw new GraphQLError('Username is too long (Max 30)', {
              extensions: {
                code: 'BAD_USER_INPUT',
              },
            });
          }

          if (username.length < 2) {
            throw new GraphQLError('Username is too short (Min 2)', {
              extensions: {
                code: 'BAD_USER_INPUT',
              },
            });
          }

          if (await getPetByUsername(username)) {
            throw new GraphQLError('Username taken', {
              extensions: {
                code: 'BAD_USER_INPUT',
              },
            });
          }
        }
      }

      try {
        if (profilePicture) {
          let profilePictureDAO = pet.ProfilePicture;

          if (profilePictureDAO) {
            profilePictureDAO.update(profilePicture);

            profilePictureDAO.save();
          } else {
            profilePictureDAO = ProfilePicture.build(profilePicture);
          }

          await pet.setProfilePicture(profilePictureDAO);

          await pet.save();
          await pet.reload();
        }

        await updatePet(pet.id, { username, name, location, type, description });
        await pet.reload();
        return pet;
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
    },

    deletePet: async (_, { id }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetById(id);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        await deletePet(pet.id);
        return { message: 'Pet successfully deleted' };
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
    },

    followPet: async (_, { id }, context) => {
      const { token } = context;
      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const authId = jwtResult.id;

      const follower = await Owner.findOne({
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

      if (!follower) {
        throw new GraphQLError('Owner does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

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

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (pet.Owner.id === follower.id) {
        throw new GraphQLError('You cannot follow your own pet', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        await pet.addFollower(follower);
        await pet.reload({ include: [{ model: Owner, as: 'Followers', include: [{ model: ProfilePicture, as: 'ProfilePicture' }] }] });
        await redis.set(`followersByPetId:${pet.id}`, JSON.stringify(pet.Followers.map((user) => user.get({ plain: true }))), 'EX', 300);
      } catch (e) {
        console.error(e);
      }

      return { success: true };
    },

    unfollowPet: async (_, { id }, context) => {
      const { token } = context;
      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const authId = jwtResult.id;

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

      if (!owner) {
        throw new GraphQLError('Owner does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

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

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        await pet.removeFollower(owner);
        await pet.reload({ include: [{ model: Owner, as: 'Followers', include: [{ model: ProfilePicture, as: 'ProfilePicture' }] }] });
        await redis.set(`followersByPetId:${pet.id}`, JSON.stringify(pet.Followers.map((user) => user.get({ plain: true }))), 'EX', 300);
      } catch (e) {
        console.error(e);
      }

      return { success: true };
    },
  },

  Query: {
    getFollowersByPetId: async (_, { petId }, context) => {
      if (!petId) {
        throw new GraphQLError('petId missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const followers = await getFollowersByPetId(petId);

      return followers;
    },

    isFollowingPet: async (_, { ownerId, petId }, context) => {
      if (!ownerId) {
        throw new GraphQLError('ownerId missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!petId) {
        throw new GraphQLError('petId missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const isFollowing = await isFollowingPet(ownerId, petId);

      return isFollowing;
    },
    getPetById: async (_, { id }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetById(id);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      return { pet };
    },
    getPetsByOwnerId: async (_, { id }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pets = await getPetsByOwnerId(id);

      return { pets };
    },

    getPetByUsername: async (_, { username }, context) => {
      if (!username) {
        throw new GraphQLError('Username missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetByUsername(username);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      return { pet };
    },

    validatePetUsername: async (_, { username }, context) => {
      if (!username) {
        throw new GraphQLError('Username missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetByUsername(username);

      return { isAvailable: pet ? false : true };
    },
  },
};
