import express from 'express';
import fs from 'fs';
import path from 'path';
import { getOwner } from '../controllers/OwnerController';
import { ProfilePicture } from '../models/ProfilePicture';
import { allowedFileTypes, upload } from '../utils/multer';

const router = express.Router();

export { router as OwnerRouter };

router.post('/profilepic/upload', upload.single('image'), async (req, res) => {
  // Retrieve the uploaded image file
  const { originalname, filename, mimetype, path: filePath, destination } = req.file;

  if (!allowedFileTypes.includes(mimetype)) {
    res.status(400).send({ message: 'File type not supported' });
    return;
  }

  const authId = req.auth.payload.sub;

  const owner = await getOwner(authId);

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

    await owner.setProfilePicture(profilePictureDAO);

    await owner.save();
    await owner.reload();
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.send(owner);
});
