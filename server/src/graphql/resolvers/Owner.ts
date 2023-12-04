import { GraphQLError } from 'graphql';
import { deleteOwner, getOwner, getOwnerByUsername, updateOwner } from '../../controllers/OwnerController';
import { isTokenValid } from '../../middleware/token';
import { Owner } from '../../models/Owner';
import { ProfilePicture } from '../../models/ProfilePicture';

export const OwnerResolver = {
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

      const user = await Owner.findOne({
        where: {
          username,
        },
      });

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
        await owner.reload({
          include: [
            {
              model: ProfilePicture,
              as: 'ProfilePicture',
            },
          ],
        });
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

      const owner = await getOwner(jwtResult.id);

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

          profilePictureDAO.save();
        } else {
          profilePictureDAO = ProfilePicture.build(profilePicture);
        }

        await owner.setProfilePicture(profilePictureDAO);
        await owner.save();
        await owner.reload({
          include: [
            {
              model: ProfilePicture,
              as: 'ProfilePicture',
            },
          ],
        });
      }

      try {
        await updateOwner(jwtResult.id, { name, username, location });
        await owner.reload();
        return owner;
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

      const owner = await getOwner(jwtResult.id);

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

    getOwner: async (_, {}, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwner(jwtResult.id);

      if (!owner) {
        throw new GraphQLError('Owner not found');
      }

      return { owner };
    },

    validateUsername: async (_, { username }) => {
      if (!username) {
        throw new GraphQLError('Username missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const owner = await getOwnerByUsername(username);

      if (owner) {
        return { isAvailable: false };
      }

      return { isAvailable: true };
    },
  },
};
