import { GraphQLError } from 'graphql';
import { getOwnerByAuthId } from '../../controllers/OwnerController';
import { createPet, deletePet, getPetById, getPetByUsername, getPetsByOwnerId, isFollowingPet, updatePet } from '../../controllers/PetController';
import { redis } from '../../db/redis';
import { isTokenValid } from '../../middleware/token';
import { Follows } from '../../models/Follow';
import { Owner } from '../../models/Owner';
import { Pet } from '../../models/Pet';
import { Post } from '../../models/Post';
import { ProfilePicture } from '../../models/ProfilePicture';

export const PetResolver = {
  Pet: {
    ProfilePicture: async (obj: Pet, {}, context) => {
      const cachedProfilePicture = await redis.get(`profilePictureByPetId:${obj.id}`);

      if (cachedProfilePicture) {
        return JSON.parse(cachedProfilePicture);
      } else {
        const profilePicture = (await obj.reload({ include: [{ model: ProfilePicture, as: 'ProfilePicture' }] })).ProfilePicture;

        await redis.set(`profilePictureByPetId:${obj.id}`, JSON.stringify(profilePicture), 'EX', 120);

        return profilePicture;
      }
    },

    Followers: async (obj: Pet, {}, context) => {
      const cachedFollowers = await redis.get(`followersByPetId:${obj.id}`);

      if (cachedFollowers) {
        const followers = JSON.parse(cachedFollowers).map((follower) => {
          return Owner.build(follower);
        });
        return followers;
      } else {
        const followers = (
          await Pet.findByPk(obj.id, {
            include: [{ model: Owner, as: 'Followers' }],
          })
        ).Followers;

        await redis.set(`followersByPetId:${obj.id}`, JSON.stringify(followers), 'EX', 300);

        return followers;
      }
    },

    Owner: async (obj: Pet, {}, context) => {
      const cachedOwner = await redis.get(`owner:${obj.id}`);

      if (cachedOwner) {
        return JSON.parse(cachedOwner);
      } else {
        const owner = (await Pet.findByPk(obj.id, { include: [{ model: Owner, as: 'Owner' }] })).Owner;

        await redis.set(`owner:${obj.id}`, JSON.stringify(owner), 'EX', 300);

        return owner;
      }
    },

    Posts: async (obj: Pet, {}, context) => {
      const cachedPosts = await redis.get(`postsByPetId:${obj.id}`);

      if (cachedPosts) {
        const posts = JSON.parse(cachedPosts).map((post) => {
          return Post.build(post);
        });
        return posts;
      } else {
        const posts = await Post.findAll({
          where: { petId: obj.id },
          order: [['createdAt', 'DESC']],
        });

        await redis.set(`postsByPetId:${obj.id}`, JSON.stringify(posts), 'EX', 120);

        return posts;
      }
    },

    followerCount: async (obj: Pet, {}, context) => {
      const cachedFollowerCount = await redis.get(`followerCount:${obj.id}`);

      if (cachedFollowerCount) {
        return cachedFollowerCount;
      } else {
        const followerCount = await Follows.count({ where: { petId: obj.id } });

        await redis.set(`followerCount:${obj.id}`, followerCount, 'EX', 60);

        return followerCount;
      }
    },

    postsCount: async (obj: Pet, {}, context) => {
      const cachedPostsCount = await redis.get(`postsCount:${obj.id}`);

      if (cachedPostsCount) {
        return cachedPostsCount;
      } else {
        const postsCount = await Post.count({ where: { petId: obj.id } });

        await redis.set(`postsCount:${obj.id}`, postsCount, 'EX', 60);

        return postsCount;
      }
    },

    totalLikes: async (obj: Pet, {}, context) => {
      const cachedTotalLikes = await redis.get(`totalLikes:${obj.id}`);

      if (cachedTotalLikes) {
        return cachedTotalLikes;
      } else {
        const posts = await Post.findAll({
          where: { petId: obj.id },
          include: [{ model: Owner, as: 'Likes' }],
        });

        // Calculate cumulative likes for the pet
        const cumulativeLikes = posts.reduce((totalLikes, post) => {
          return totalLikes + (post.Likes?.length || 0);
        }, 0);

        await redis.set(`totalLikes:${obj.id}`, cumulativeLikes, 'EX', 300);

        return cumulativeLikes;
      }
    },
  },

  Query: {
    isFollowingPet: async (_, { ownerId, petId }, context) => {
      if (!ownerId) {
        throw new GraphQLError('ownerId missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!petId) {
        throw new GraphQLError('petId missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const isFollowing = await isFollowingPet(ownerId, petId);

      return isFollowing;
    },
    getPetById: async (_, { id }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetById(id);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      return { pet };
    },
    getPetsByOwnerId: async (_, { id }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pets = await getPetsByOwnerId(id);

      return { pets };
    },

    getPetByUsername: async (_, { username }, context) => {
      if (!username) {
        throw new GraphQLError('Username missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetByUsername(username);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      return { pet };
    },

    validatePetUsername: async (_, { username }, context) => {
      if (!username) {
        throw new GraphQLError('Username missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetByUsername(username);

      return { isAvailable: pet ? false : true };
    },
  },

  Mutation: {
    createPet: async (_, { username, name, type, description, location, profilePicture }, context) => {
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

      const owner = await getOwnerByAuthId(authId);

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

        if (profilePicture) {
          const profilePictureDAO = ProfilePicture.build(profilePicture);

          await newPet.setProfilePicture(profilePictureDAO);
          await newPet.save();
          await newPet.reload({});
        }
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

    updatePet: async (_, { id, username, name, type, description, location, profilePicture }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetById(id);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      if (type) {
        if (!Pet.getAttributes().type.values.includes(type.toUpperCase())) {
          throw new GraphQLError('Incorrect type provided', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          });
        }
        type = type.toUpperCase();
      }

      if (username) {
        if (username !== pet.username) {
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
        }
      }

      try {
        if (profilePicture) {
          let profilePictureDAO = pet.ProfilePicture;

          if (profilePictureDAO) {
            profilePictureDAO.update(profilePicture);

            profilePictureDAO.save();
          } else {
            profilePictureDAO = ProfilePicture.build(profilePicture);
          }

          await pet.setProfilePicture(profilePictureDAO);

          await pet.save();
          await pet.reload();

          await redis.set(`profilePictureByPetId:${pet.id}`, JSON.stringify(profilePictureDAO), 'EX', 120);
        }

        await updatePet(pet.id, { username, name, location, type, description });
        await pet.reload();
        return pet;
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
    },

    deletePet: async (_, { id }, context) => {
      if (!id) {
        throw new GraphQLError('ID missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetById(id);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        await deletePet(pet.id);
        return { message: 'Pet successfully deleted' };
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
    },

    followPet: async (_, { id }, context) => {
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

      const follower = await getOwnerByAuthId(authId);

      if (!follower) {
        throw new GraphQLError('Owner does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await Pet.findOne({
        where: {
          id,
        },
        include: [{ model: Owner, as: 'Owner' }],
      });

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (pet.Owner.id === follower.id) {
        throw new GraphQLError('You cannot follow your own pet', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        await pet.addFollower(follower);
        await pet.reload();

        const cachedFollowerCount = Number(await redis.get(`followerCount:${pet.id}`));
        await redis.set(`followerCount:${pet.id}`, cachedFollowerCount + 1, 'EX', 60);
      } catch (e) {
        console.error(e);
      }

      return { success: true };
    },

    unfollowPet: async (_, { id }, context) => {
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

      const owner = await getOwnerByAuthId(authId);

      if (!owner) {
        throw new GraphQLError('Owner does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const pet = await getPetById(id);

      if (!pet) {
        throw new GraphQLError('Pet does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        await pet.removeFollower(owner);
        await pet.reload();
        const cachedFollowerCount = Number(await redis.get(`followerCount:${pet.id}`));
        await redis.set(`followerCount:${pet.id}`, cachedFollowerCount - 1, 'EX', 60);
      } catch (e) {
        console.error(e);
      }

      return { success: true };
    },
  },
};
