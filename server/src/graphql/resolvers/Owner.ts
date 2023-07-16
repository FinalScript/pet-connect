import { GraphQLError } from 'graphql';
import { Owner } from '../../models/Owner';
import { isTokenValid } from '../../middleware/token';
import { deleteOwner, getOwner, getOwnerByUsername, updateOwner } from '../../controllers/OwnerController';

export const OwnerResolver = {
  Mutation: {
    signup: async (_, { username, name, location }, context) => {
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

      const owner = await Owner.create({ authId: jwtResult.id, username, name, location });

      return { owner };
    },
    updateOwner: async (_, { username, name, location }, context) => {
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
        throw new GraphQLError('Owner not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
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
