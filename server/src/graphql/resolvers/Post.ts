import { GraphQLError } from 'graphql/error';
import { getPetById } from '../../controllers/PetController';
import { createPost, deletePost, getPostById, updatePost } from '../../controllers/PostController';
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

    updatePost: async (_, { id, description, media }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const post = await getPostById(id);

      if (!post) {
        throw new GraphQLError('Post does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!media) {
        throw new GraphQLError('Media cannot be null', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        await updatePost(post.id, { description, media });
        await post.reload();
        return post;
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
    },

    deletePost: async (_, { id }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const post = await getPostById(id);

      if (!post) {
        throw new GraphQLError('Post does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        await deletePost(post.id);
        return { message: 'Post successfully deleted' };
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
    },
  },

  Query: {
    getPostById: async (_, { id }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const post = await getPostById(id);

      if (!post) {
        throw new GraphQLError('Post does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      return { post: post };
    },
  },
};
