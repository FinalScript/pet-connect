import { GraphQLError } from 'graphql/error';
import { Sequelize } from 'sequelize';
import { getOwnerByAuthId } from '../../controllers/OwnerController';
import { getPetById } from '../../controllers/PetController';
import { createPost, deletePost, getAllPosts, getPostById, getPostByIdWithLikers, getPostsByPetId } from '../../controllers/PostController';
import { isTokenValid } from '../../middleware/token';
import { Media } from '../../models/Media';
import { Pet } from '../../models/Pet';
import { Post } from '../../models/Post';
import { Owner } from '../../models/Owner';
import { redis } from '../../db/redis';

export const PostResolver = {
  Post: {
    Media: async (obj: Post, {}, context) => {
      const media = (await obj.reload({ include: [{ model: Media, as: 'Media' }] })).Media;

      return media;
    },
    Author: async (obj: Post, {}, context) => {
      const author = (await obj.reload({ include: [{ model: Pet, as: 'Author' }] })).Author;

      return author;
    },
    Comments: async (obj: Post, {}, context) => {
      const comments = (await obj.reload({ include: [{ model: Pet, as: 'Comments' }] })).Comments;

      return comments;
    },
    likesCount: async (obj: Post, {}, context) => {
      const cachedLikesCount = await redis.get(`likesCount:${obj.id}`);

      if (cachedLikesCount) {
        return cachedLikesCount;
      } else {
        const likesCount = (await obj.reload({ include: [{ association: 'Likes' }] })).Likes.length;

        await redis.set(`likesCount:${obj.id}`, likesCount, 'EX', 120);

        return likesCount;
      }
    },
  },

  Query: {
    getAllPosts: async (_, {}, context) => {
      const posts = await getAllPosts();

      return { posts };
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

    getFollowing: async (_, {}, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const ownerWithFollowedPets = await Owner.findOne({
        where: {
          authId: jwtResult.id,
        },
        include: [
          { model: Pet, as: 'FollowedPets', include: [{ model: Post, as: 'Posts' }] },
          { model: Pet, as: 'Pets', include: [{ model: Post, as: 'Posts' }] },
        ],
      });

      if (!ownerWithFollowedPets) {
        throw new GraphQLError('Owner not found');
      }

      const followedPets: Pet[] = [...ownerWithFollowedPets.FollowedPets, ...ownerWithFollowedPets.Pets];
      const allFollowedPosts = followedPets.reduce((allPosts, pet) => {
        const posts = pet.Posts || [];
        return [...allPosts, ...posts];
      }, []);
      const following: Post[] = allFollowedPosts.sort((postA: Post, postB: Post) => Number(postB.createdAt) - Number(postA.createdAt));
      return following;
    },
    getForYou: async (_, {}, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const forYou = await Post.findAll({
        order: Sequelize.literal('rand()'),
        limit: 20,
      });

      return forYou;
    },

    isLikingPost: async (_, { id }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwnerByAuthId(jwtResult.id);

      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const post = await getPostByIdWithLikers(id);

      if (!post) {
        throw new GraphQLError('Post does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const likedOwners = post.Likes || [];
      const liked = likedOwners.some((i) => i.id === owner.id);

      return liked;
    },
  },
  Mutation: {
    createPost: async (_, { petId, description, media }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

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
        await post.reload();
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }

      return { post };
    },

    deletePost: async (_, { id }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwnerByAuthId(jwtResult.id);

      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const post = await Post.findByPk(id, {
        include: [{ model: Pet, as: 'Author' }],
      });

      if (!post) {
        throw new GraphQLError('Post does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (post.Author.ownerId !== owner.id) {
        throw new GraphQLError("You don't have permissions to delete this post.", {
          extensions: {
            code: 'FORBIDDEN',
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

    likePost: async (_, { id }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwnerByAuthId(jwtResult.id);

      if (!id) {
        throw new GraphQLError('Please provide petId', {
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
        await post.addLike(owner);
        await post.reload({ include: [{ association: 'Likes' }] });

        await redis.set(`likesCount:${post.id}`, post.Likes.length, 'EX', 120);
        return { newLikesCount: post.Likes.length };
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
    },

    unlikePost: async (_, { id }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwnerByAuthId(jwtResult.id);

      if (!id) {
        throw new GraphQLError('Please provide petId', {
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
        await post.removeLike(owner);

        await post.reload({ include: [{ association: 'Likes' }] });

        await redis.set(`likesCount:${post.id}`, post.Likes.length, 'EX', 120);
        return { newLikesCount: post.Likes.length };
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
