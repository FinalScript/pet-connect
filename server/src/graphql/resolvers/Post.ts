import { GraphQLError } from 'graphql/error';
import { getPetById } from '../../controllers/PetController';
import { createPost, deletePost, getAllPosts, getPostById, getPostsByPetId, updatePost } from '../../controllers/PostController';
import { Post } from '../../models/Post';
import { Media } from '../../models/Media';
import { Pet } from '../../models/Pet';

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

        const mediaDAO = Media.build(media);

        await post.setMedia(mediaDAO);
        await post.save();
        await post.reload({
          include: [
            {
              model: Media,
              as: 'Media',
            },
            {
              model: Pet,
              as: 'author',
              include: [{ all: true }],
            },
          ],
        });
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }

      return { post: { ...post.dataValues, Media: post.dataValues.Media.dataValues, author: post.dataValues.author.dataValues } };
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
    getAllPosts: async (_, {}, context) => {
      const posts = await getAllPosts();

      return { posts };
    },
    
    getPostsByPetId: async (_, { petId }, context) => {
      if (!petId) {
        throw new GraphQLError('Pet ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        const posts = await getPostsByPetId(petId);
        return {posts};
      } catch (error) {
        console.error(error);
        throw new GraphQLError('Error fetching posts', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },

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

      return { post };
    },
  },
};
