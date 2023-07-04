import { GraphQLError } from 'graphql';
import { Owner } from '../../models/Owner';
import { isTokenValid } from '../../middleware/token';

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

      const owner = await Owner.findOne({
        where: {
          authId: jwtResult.id,
        },
      });

      if (!owner) {
        throw new GraphQLError('Owner not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      await Owner.update({ username, name, location }, { where: { authId: jwtResult.id } });
      await owner.reload();

      return owner;
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

      const owner = await Owner.findOne({
        where: {
          authId: jwtResult.id,
        },
      });

      if (!owner) {
        throw new GraphQLError('Owner not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      return { owner };
    },
  },
};
