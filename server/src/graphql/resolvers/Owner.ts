import { GraphQLError } from 'graphql';
import { deleteOwner, getOwnerByAuthId, getOwnerById, getOwnerByUsername, updateOwner } from '../../controllers/OwnerController';
import { redis } from '../../db/redis';
import { isTokenValid } from '../../middleware/token';
import { Owner } from '../../models/Owner';
import { Pet } from '../../models/Pet';
import { ProfilePicture } from '../../models/ProfilePicture';

export const OwnerResolver = {
  Owner: {
    ProfilePicture: async (obj: Owner, {}, context) => {
      const cachedProfilePicture = await redis.get(`profilePictureByOwnerId:${obj.id}`);

      if (cachedProfilePicture) {
        return JSON.parse(cachedProfilePicture);
      } else {
        const profilePicture = (await Owner.findByPk(obj.id, { include: [{ model: ProfilePicture, as: 'ProfilePicture' }] })).ProfilePicture;

        await redis.set(`profilePictureByOwnerId:${obj.id}`, JSON.stringify(profilePicture), 'EX', 120);

        return profilePicture;
      }
    },

    Following: async (obj: Owner, {}, context) => {
      const cachedFollowing = await redis.get(`following:${obj.id}`);

      if (cachedFollowing) {
        return JSON.parse(cachedFollowing);
      } else {
        const following = (await Owner.findByPk(obj.id, { include: [{ model: Pet, as: 'FollowedPets' }] })).FollowedPets;

        await redis.set(`following:${obj.id}`, JSON.stringify(following), 'EX', 120);

        return following;
      }
    },

    Pets: async (obj: Owner, {}, context) => {
      const cachedPets = await redis.get(`petsByOwnerId:${obj.id}`);

      if (cachedPets) {
        const pets: Pet[] = JSON.parse(cachedPets).map((pet: Pet) => {
          return Pet.build(pet);
        });

        return pets;
      } else {
        const pets = (await Owner.findByPk(obj.id, { include: [{ model: Pet, as: 'Pets' }] })).Pets;

        await redis.set(`petsByOwnerId:${obj.id}`, JSON.stringify(pets), 'EX', 120);

        return pets;
      }
    },

    followingCount: async (obj: Owner, {}, context) => {
      const cachedFollowingCount = await redis.get(`followingCount:${obj.id}`);

      if (cachedFollowingCount) {
        return cachedFollowingCount;
      } else {
        const followingCount = (await Owner.findByPk(obj.id, { include: [{ model: Pet, as: 'FollowedPets' }] }))?.FollowedPets?.length;

        await redis.set(`followingCount:${obj.id}`, followingCount, 'EX', 120);

        return followingCount;
      }
    },
  },

  Query: {
    verifyToken: async (_, {}, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      return { valid: true };
    },

    getOwner: async (_, { authId }, context) => {
      if (!authId && !context.token) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const { token } = context;

      const jwtResult = await isTokenValid(token);

      let authIdToUse = jwtResult.id;

      if (jwtResult?.error || !jwtResult?.id) {
        authIdToUse = authId;
      }

      const cachedOwner = await redis.get(`owner:${authIdToUse}`);

      if (cachedOwner) {
        return { owner: JSON.parse(cachedOwner) };
      } else {
        const owner = await getOwnerByAuthId(authIdToUse);

        if (!owner) {
          throw new GraphQLError('Owner not found');
        }

        await redis.set(`owner:${authIdToUse}`, JSON.stringify(owner), 'EX', 300);

        return { owner };
      }
    },

    getOwnerById: async (_, { id }, context) => {
      if (!id) {
        throw new GraphQLError('Id missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const cachedOwner = await redis.get(`owner:${id}`);

      if (cachedOwner) {
        return { owner: JSON.parse(cachedOwner) };
      } else {
        const owner = await getOwnerById(id);

        if (!owner) {
          throw new GraphQLError('Owner not found');
        }

        await redis.set(`owner:${id}`, JSON.stringify(owner), 'EX', 300);

        return { owner };
      }
    },

    validateUsername: async (_, { username }) => {
      if (!username) {
        throw new GraphQLError('Username missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const cachedOwner = await redis.get(`owner:${username}`);

      if (cachedOwner) {
        return { isAvailable: false };
      } else {
        const owner = await getOwnerByUsername(username);

        await redis.set(`owner:${username}`, JSON.stringify(owner), 'EX', 300);

        if (!owner) {
          return { isAvailable: true };
        }

        return { isAvailable: false };
      }
    },
  },
  Mutation: {
    signup: async (_, { username, name, location, profilePicture }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      if (!username) {
        throw new GraphQLError('Username missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const user = await getOwnerByUsername(username);

      if (user) {
        throw new GraphQLError('Username taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let owner = await Owner.create({ authId: jwtResult.id, username, name, location });

      if (profilePicture) {
        const profilePictureDAO = ProfilePicture.build(profilePicture);

        await owner.setProfilePicture(profilePictureDAO);
        await owner.save();
      }

      return { owner };
    },
    updateOwner: async (_, { username, name, location, profilePicture }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwnerByAuthId(jwtResult.id);

      if (!owner) {
        throw new GraphQLError('Owner not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      if (username) {
        if (username !== owner.username) {
          if (await getOwnerByUsername(username)) {
            throw new GraphQLError('Username taken', {
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
        }
      }

      if (profilePicture) {
        let profilePictureDAO = owner.ProfilePicture;

        if (profilePictureDAO) {
          profilePictureDAO.update(profilePicture);

          await profilePictureDAO.save();
          await profilePictureDAO.reload();
        } else {
          profilePictureDAO = ProfilePicture.build(profilePicture);
        }

        await owner.setProfilePicture(profilePictureDAO);
        await owner.save();

        await redis.set(`profilePictureByOwnerId:${owner.id}`, JSON.stringify(profilePictureDAO), 'EX', 120);
      }

      try {
        await updateOwner(jwtResult.id, { name, username, location });
        await owner.reload();
        await redis.set(`owner:${owner.id}`, JSON.stringify(owner), 'EX', 300);
        await redis.set(`owner:${owner.username}`, JSON.stringify(owner), 'EX', 300);
        await redis.set(`owner:${owner.authId}`, JSON.stringify(owner), 'EX', 300);
        return { owner };
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
    },

    deleteOwner: async (_, {}, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwnerByAuthId(jwtResult.id);

      if (!owner) {
        throw new GraphQLError('Owner not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      await deleteOwner(jwtResult.id);

      return { message: 'Account successfully deleted' };
    },
  },
};
