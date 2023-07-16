import { GraphQLError } from 'graphql';
import { isTokenValid } from '../../middleware/token';
import { Pet } from '../../models/Pet';

export const PetResolver = {
  Mutation: {
    createPet: async (_, { username, name, type, description, location }, context) => {
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

      const petUserName = await Pet.findOne({
        where: {
          username,
        },
      });

      if (petUserName) {
        throw new GraphQLError('Username taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!type) {
        throw new GraphQLError('Type missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      //   if (!Object.values(PetType).includes(type)) {
      //     throw new GraphQLError('Invalid PetType', {
      //       extensions: {
      //         code: 'BAD_USER_INPUT',
      //       },
      //     });
      //   }

      if (!name) {
        throw new GraphQLError('Name missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await Pet.create({ username, name, type, description, location });

      return { pet };
    },
    Query: {},
  },
};
