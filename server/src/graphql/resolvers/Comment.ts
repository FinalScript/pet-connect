import { GraphQLError } from 'graphql/error';
import { getPetById } from '../../controllers/PetController';
import { createPost, deletePost, getAllPosts, getPostById, getPostsByPetId, updatePost } from '../../controllers/PostController';
import { Post } from '../../models/Post';
import { Media } from '../../models/Media';
import { Pet } from '../../models/Pet';
import { isTokenValid } from '../../middleware/token';
import { getOwner } from '../../controllers/OwnerController';
import { Owner } from '../../models/Owner';
import { Follows } from '../../models/Follow';
import { ProfilePicture } from '../../models/ProfilePicture';
import { Sequelize } from 'sequelize';
import { createComment, getCommentsByPostId } from '../../controllers/CommentController';
import { Comment } from '../../models/Comment';

export const CommentResolver = {
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

      const owner = await getOwner(authId);

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
        await comment.reload({
          include: [{ model: Owner, as: 'author', include: [{ model: ProfilePicture, as: 'ProfilePicture' }] }],
        });
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
};
