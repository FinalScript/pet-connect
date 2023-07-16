import { GraphQLError } from 'graphql/error';
import { getPetById } from '../../controllers/PetController';
import { createPost } from '../../controllers/PostController';
import { Post } from '../../models/Post';

export const PostResolver = {
  Mutation: {
    createPost: async (_, { petId, description, media }, context) => {
      if (!petId) {
        throw new GraphQLError('Please provide petId', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetById(petId);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!media) {
        throw new GraphQLError('Media missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let post: Post;

      try {
        post = await createPost({ petId, description, media });
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
      return { post: post };
    },
  },
};
