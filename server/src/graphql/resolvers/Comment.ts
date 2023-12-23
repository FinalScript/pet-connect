import { GraphQLError } from 'graphql/error';
import { createComment, getCommentsByPostId } from '../../controllers/CommentController';
import { getOwnerByAuthId } from '../../controllers/OwnerController';
import { getPostById } from '../../controllers/PostController';
import { isTokenValid } from '../../middleware/token';
import { Comment } from '../../models/Comment';
import { Owner } from '../../models/Owner';

export const CommentResolver = {
  Comment: {
    Author: async (obj: Comment, {}, context) => {
      const author = (await obj.reload({ include: [{ model: Owner, as: 'Author' }] })).Author;

      return author;
    },
  },
  Query: {
    getCommentsByPostId: async (_, { postId }, context) => {
      if (!postId) {
        throw new GraphQLError('postId missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        const comments = await getCommentsByPostId(postId);
        return comments;
      } catch (error) {
        console.error(error);
        throw new GraphQLError('Error fetching comments', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },
  },
  Mutation: {
    createComment: async (_, { postId, text }, context) => {
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
        throw new GraphQLError('postId missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const authId = jwtResult.id;

      const owner = await getOwnerByAuthId(authId);

      if (!owner) {
        throw new GraphQLError('Owner does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const post = await getPostById(postId);

      if (!post) {
        throw new GraphQLError('post does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let comment: Comment;

      try {
        comment = await createComment({ postId, text, ownerId: owner.id });

        await post.addComment(comment);
        await post.save();
        await comment.setAuthor(owner);
        return comment;
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
};
