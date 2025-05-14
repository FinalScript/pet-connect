import express from 'express';
import fs from 'fs';
import path from 'path';
import { getOwner } from '../controllers/OwnerController';
import { ProfilePicture } from '../models/ProfilePicture';
import { allowedFileTypes, upload } from '../utils/multer';

const router = express.Router();

export { router as PetRouter };

router.post('/:id/profilepic/upload', upload.single('image'), async (req, res) => {
  // Retrieve the uploaded image file
  const { originalname, destination, filename, mimetype, path: filePath } = req.file;

  if (!allowedFileTypes.includes(mimetype)) {
    res.status(400).send({ message: 'File type not supported' });
    return;
  }

  const authId = req.auth.payload.sub;
  const petId = req.params.id;

  const owner = await getOwner(authId);

  if (!owner || !owner.Pets) {
    res.status(503).send({ message: 'Unknown error' });
    return;
  }

  const pet = owner.Pets.find((pet) => {
    if (pet.id === petId) {
      return pet;
    }
  });

  if (!pet) {
    res.status(404).send({ message: 'Pet not found' });
    return;
  }

  try {
    const { photoId } = req.body;

    let profilePictureDAO = await ProfilePicture.findByPk(photoId);

    if (profilePictureDAO) {
      fs.rmSync(profilePictureDAO.path);

      const newPath = destination + profilePictureDAO.id + path.extname(originalname);

      profilePictureDAO.path = newPath;
      profilePictureDAO.name = profilePictureDAO.id + path.extname(originalname);

      profilePictureDAO.save();

      fs.renameSync(filePath, newPath);
    } else {
      profilePictureDAO = ProfilePicture.build({
        name: filename,
        path: filePath,
        type: mimetype,
      });

      const newPath = destination + profilePictureDAO.id + path.extname(originalname);

      profilePictureDAO.path = newPath;
      profilePictureDAO.name = profilePictureDAO.id + path.extname(originalname);

      fs.renameSync(filePath, newPath);
    }

    await pet.setProfilePicture(profilePictureDAO);

    await pet.save();
    await pet.reload();
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.send(pet);
});
