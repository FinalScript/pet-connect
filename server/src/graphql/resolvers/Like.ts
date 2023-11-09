import { GraphQLError } from 'graphql';
import { isTokenValid } from '../../middleware/token';
import { createLike, deleteLike, getLikeById } from '../../controllers/LikeController';
import { getPostById } from '../../controllers/PostController';
import { getOwner } from '../../controllers/OwnerController';
import { Post } from '../../models/Post';
import { Owner } from '../../models/Owner';
import { Like } from '../../models/Like';

export const LikeResolver = {
  Mutation: {
    likePost: async (_, { postId, ownerId }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      if (!postId) {
        throw new GraphQLError('Post ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!ownerId) {
        throw new GraphQLError('Owner ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const post = await getPostById(postId);
      const owner = await getOwner(ownerId);

      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      if (!owner) {
        throw new GraphQLError('Owner not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      const newLike = await createLike({ postId, ownerId });
      return { newLike };
    },

    unlikePost: async (_, { likeId, postId }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      if (!likeId) {
        throw new GraphQLError('Like ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!postId) {
        throw new GraphQLError('Post ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const like = await getLikeById(likeId);
      const post = await getPostById(postId);

      if (!like) {
        throw new GraphQLError('Like not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      await deleteLike(likeId);

      return { message: 'Post unliked' };
    },
  },
};
