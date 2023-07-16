import { GraphQLError } from 'graphql';
import { isTokenValid } from '../../middleware/token';
import { Pet } from '../../models/Pet';
import { getOwner } from '../../controllers/OwnerController';
import { createPet, getPetByUsername } from '../../controllers/PetController';

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

      const authId = jwtResult.id;

      const owner = await getOwner(authId);

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
  },
};
