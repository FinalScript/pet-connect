import { GraphQLError } from 'graphql';
import { isTokenValid } from '../../middleware/token';
import { Pet } from '../../models/Pet';
import { getOwner } from '../../controllers/OwnerController';
import { createPet, deletePet, getPetById, getPetByUsername, updatePet } from '../../controllers/PetController';
import { storeUpload } from '../../utils/multer';
import { ProfilePicture } from '../../models/ProfilePicture';
import path from 'path';
import fs from 'fs';

export const PetResolver = {
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

      const owner = await getOwner(authId);

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

        if (profilePicture.file) {
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

          await newPet.setProfilePicture(profilePictureDAO);
          await newPet.save();
          await newPet.reload({
            include: [
              {
                model: ProfilePicture,
                as: 'ProfilePicture',
              },
            ],
          });
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

      if (!Pet.getAttributes().type.values.includes(type.toUpperCase())) {
        throw new GraphQLError('Incorrect type provided', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      type = type.toUpperCase();

      if (username) {
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

      try {
        if (profilePicture?.file) {
          const { filename, filePath, mimetype, root: destination } = await storeUpload(profilePicture.file);

          let profilePictureDAO = pet.ProfilePicture;

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

          await pet.setProfilePicture(profilePictureDAO);

          await pet.save();
          await pet.reload();
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
  },

  Query: {
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
};