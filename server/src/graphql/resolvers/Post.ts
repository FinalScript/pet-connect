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
import { Comment } from '../../models/Comment';

export const PostResolver = {
  Post: {
    Media: async (obj: Post, {}, context) => {
      const cachedMedia = await redis.get(`mediaByPostId:${obj.id}`);

      if (cachedMedia) {
        return JSON.parse(cachedMedia);
      } else {
        const media = (await Post.findByPk(obj.id, { include: [{ model: Media, as: 'Media' }] })).Media;

        await redis.set(`mediaByPostId:${obj.id}`, JSON.stringify(media), 'EX', 300);

        return media;
      }
    },
    Author: async (obj: Post, {}, context) => {
      const cachedAuthor = await redis.get(`pet:${obj.id}`);

      if (cachedAuthor) {
        return JSON.parse(cachedAuthor);
      } else {
        const author = (await Post.findByPk(obj.id, { include: [{ model: Pet, as: 'Author' }] })).Author;

        await redis.set(`pet:${obj.id}`, JSON.stringify(author), 'EX', 300);

        return author;
      }
    },
    Comments: async (obj: Post, {}, context) => {
      const cachedComments = await redis.get(`commentsByPostId:${obj.id}`);

      if (cachedComments) {
        const comments = JSON.parse(cachedComments).map((comment) => {
          return Comment.build(comment);
        });
        return comments;
      } else {
        const comments = (await Post.findByPk(obj.id, { include: [{ model: Pet, as: 'Comments' }] })).Comments;

        await redis.set(`commentsByPostId:${obj.id}`, JSON.stringify(comments), 'EX', 300);

        return comments;
      }
    },
    likesCount: async (obj: Post, {}, context) => {
      const cachedLikesCount = await redis.get(`likesCount:${obj.id}`);

      if (cachedLikesCount) {
        return cachedLikesCount;
      } else {
        const likesCount = (await Post.findByPk(obj.id, { include: [{ association: 'Likes' }] })).Likes.length;

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

      const cachedPost = await redis.get(`post:${id}`);

      if (cachedPost) {
        return { post: JSON.parse(cachedPost) };
      } else {
        const post = await getPostById(id);

        if (!post) {
          throw new GraphQLError('Post does not exist', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          });
        }

        await redis.set(`post:${id}`, JSON.stringify(post), 'EX', 300);

        return { post };
      }
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

      const cachedIsLikingPost = await redis.get(`isLikingPost:${jwtResult.id}:${id}`);

      if (cachedIsLikingPost) {
        return JSON.parse(cachedIsLikingPost);
      }

      let owner = JSON.parse(await redis.get(`owner:${jwtResult.id}`));

      if (!owner) {
        owner = await getOwnerByAuthId(jwtResult.id);
      }

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

      await redis.set(`isLikingPost:${jwtResult.id}:${id}`, JSON.stringify(liked), 'EX', 120);

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

        await redis.set(`post:${post.id}`, JSON.stringify(post), 'EX', 300);

        const cachedPosts = await redis.get(`postsByPetId:${petId}`);

        if (cachedPosts) {
          const posts: Post[] = JSON.parse(cachedPosts).map((post) => {
            return Post.build(post);
          });

          posts.push(post);

          await redis.set(`postsByPetId:${petId}`, JSON.stringify(posts), 'EX', 300);
        }
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
        await post.reload({ include: [{ association: 'Likes' }, { model: Pet, as: 'Author' }] });

        if (post.Likes.findIndex((like) => like.id === owner.id) !== -1) {
          throw new GraphQLError('You are already liking this post', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          });
        }

        await post.addLike(owner);
        await post.reload();

        await redis.set(`likesCount:${post.id}`, post.Likes.length, 'EX', 120);
        await redis.set(`isLikingPost:${jwtResult.id}:${id}`, JSON.stringify(true), 'EX', 120);

        const cachedTotalLikes = await redis.get(`totalLikes:${post.Author.id}`);

        if (cachedTotalLikes) {
          await redis.set(`totalLikes:${post.Author.id}`, Number(cachedTotalLikes) + 1, 'EX', 300);
        }

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
        await post.reload({ include: [{ association: 'Likes' }, { model: Pet, as: 'Author' }] });

        if (post.Likes.findIndex((like) => like.id === owner.id) === -1) {
          throw new GraphQLError('You are not liking this post', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          });
        }

        await post.removeLike(owner);
        await post.reload();

        await redis.set(`likesCount:${post.id}`, post.Likes.length, 'EX', 120);
        await redis.set(`isLikingPost:${jwtResult.id}:${id}`, JSON.stringify(false), 'EX', 120);

        const cachedTotalLikes = await redis.get(`totalLikes:${post.Author.id}`);

        if (cachedTotalLikes) {
          await redis.set(`totalLikes:${post.Author.id}`, Number(cachedTotalLikes) - 1, 'EX', 300);
        }

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
