import { GraphQLError } from 'graphql';
import { Owner } from '../../models/Owner';
import { isTokenValid } from '../../middleware/token';
import { deleteOwner, getOwner, getOwnerByUsername, updateOwner } from '../../controllers/OwnerController';
import { storeUpload, upload } from '../../utils/multer';
import { ProfilePicture } from '../../models/ProfilePicture';
import path from 'path';
import fs from 'fs';

export const OwnerResolver = {
  Mutation: {
    signup: async (_, { username, name, location, profilePicture }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      if (!username) {
        throw new GraphQLError('Username missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const user = await Owner.findOne({
        where: {
          username,
        },
      });

      if (user) {
        throw new GraphQLError('Username taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let owner = await Owner.create({ authId: jwtResult.id, username, name, location });
  
      if (profilePicture?.file) {
        const { filename, filePath, mimetype, root } = await storeUpload(profilePicture.file);

        const profilePictureDAO = ProfilePicture.build({
          name: filename,
          path: filePath,
          type: mimetype,
        });

        const newPath = root + profilePictureDAO.id + path.extname(filename);

        profilePictureDAO.path = newPath;
        profilePictureDAO.name = profilePictureDAO.id + path.extname(filename);

        fs.renameSync(filePath, newPath);

        await owner.setProfilePicture(profilePictureDAO);
        await owner.save();
        await owner.reload({
          include: [
            {
              model: ProfilePicture,
              as: 'ProfilePicture',
            },
          ],
        });
      }

      return { owner };
    },
    updateOwner: async (_, { username, name, location, profilePicture }, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwner(jwtResult.id);

      if (!owner) {
        throw new GraphQLError('Owner not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      if (username) {
        if (await getOwnerByUsername(username)) {
          throw new GraphQLError('Username taken', {
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
      }

      if (profilePicture?.file) {
        const { filename, filePath, mimetype, root: destination } = await storeUpload(profilePicture.file);

        let profilePictureDAO = owner.ProfilePicture;

        if (profilePictureDAO) {
          fs.rmSync(profilePictureDAO.path);

          const newPath = destination + profilePictureDAO.id + path.extname(filename);

          profilePictureDAO.path = newPath;
          profilePictureDAO.name = profilePictureDAO.id + path.extname(filename);

          profilePictureDAO.save();

          fs.renameSync(filePath, newPath);
        } else {
          profilePictureDAO = ProfilePicture.build({
            name: filename,
            path: filePath,
            type: mimetype,
          });

          const newPath = destination + profilePictureDAO.id + path.extname(filename);

          profilePictureDAO.path = newPath;
          profilePictureDAO.name = profilePictureDAO.id + path.extname(filename);

          fs.renameSync(filePath, newPath);
        }

        await owner.setProfilePicture(profilePictureDAO);

        await owner.save();
        await owner.reload();
      }

      try {
        await updateOwner(jwtResult.id, { name, username, location });
        await owner.reload();
        return owner;
      } catch (e) {
        console.error(e);

        throw new GraphQLError(e.message, {
          extensions: {
            code: 'SQL_ERROR',
          },
        });
      }
    },

    deleteOwner: async (_, {}, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwner(jwtResult.id);

      if (!owner) {
        throw new GraphQLError('Owner not found', {
          extensions: {
            code: 'PERSISTED_QUERY_NOT_FOUND',
          },
        });
      }

      await deleteOwner(jwtResult.id);

      return { message: 'Account successfully deleted' };
    },
  },

  Query: {
    verifyToken: async (_, {}, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      return { valid: true };
    },

    getOwner: async (_, {}, context) => {
      const { token } = context;

      const jwtResult = await isTokenValid(token);

      if (jwtResult?.error || !jwtResult?.id) {
        throw new GraphQLError(jwtResult?.error.toString(), {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const owner = await getOwner(jwtResult.id);

      if (!owner) {
        throw new GraphQLError('Owner not found');
      }

      return { owner: owner.dataValues, pets: owner.Pets };
    },

    validateUsername: async (_, { username }) => {
      if (!username) {
        throw new GraphQLError('Username missing', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const owner = await getOwnerByUsername(username);

      if (owner) {
        return { isAvailable: false };
      }

      return { isAvailable: true };
    },
  },
};
