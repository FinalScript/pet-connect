import express from 'express';
import { getOwner } from '../controllers/OwnerController';
import { createPet, getPet, deletePet, updatePet } from '../controllers/PetController';
import { Pet } from '../models/Pet';
import { Owner } from '../models/Owner';
import { trimValuesInObject } from '../utils/trimValuesInObject';
import multer from 'multer';
import { ProfilePicture } from '../models/ProfilePicture';
import fs from 'fs';

// Set up Multer middleware
const upload = multer({
  dest: 'uploads/', // Specify the directory to save the uploaded files
});

const router = express.Router();

export { router as PetRouter };

router.get('/:id?', async (req, res) => {
  const petId = req.params.id;

  if (!petId) {
    res.status(400).send({ message: 'Id missing' });
    return;
  }

  let pet: Pet;

  try {
    pet = await getPet(petId);

    if (!pet) {
      res.status(404).send({ message: 'Pet not found' });

      return;
    }
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.send(pet);
});

router.delete('/delete/:id?', async (req, res) => {
  const petId = req.params.id;

  if (!petId) {
    res.status(400).send({ message: 'Id missing' });
    return;
  }

  const pet = await getPet(petId);

  if (!pet) {
    res.status(404).send({ message: 'Pet not found' });
    return;
  }

  try {
    await deletePet(petId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
  }

  res.status(200).send({ message: 'Pet successfully deleted' });
});

router.post('/:id/profilepic/upload', upload.single('image'), async (req, res) => {
  // Retrieve the uploaded image file
  const { filename, mimetype, path, buffer } = req.file;
  const authId = req.auth.payload.sub;
  const petId = req.params.id;

  const pet = (
    await Owner.findOne({
      where: { authId },
      include: [
        {
          model: Pet,
          as: 'pets',
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    })
  ).pets[0];

  // Read the image file from the disk
  const imageBuffer = fs.readFileSync(path);

  const profilePictureDAO = ProfilePicture.build({
    name: filename,
    path,
    data: imageBuffer,
    type: mimetype,
  });

  pet.setProfilePicture(profilePictureDAO);

  await pet.save();

  res.send(pet);
});

router.post('/create', async (req, res) => {
  const authId = req.auth.payload.sub;
  req.body = trimValuesInObject(req.body);
  let { name, type, description, location } = req.body;
  const owner = await getOwner(authId);

  if (!owner) {
    res.status(404).send({ message: 'Owner does not exist' });
    return;
  }

  if (!name) {
    res.status(400).send({ message: 'Name missing' });
    return;
  }

  if (!type) {
    res.status(400).send({ message: 'Type missing' });
    return;
  } else if (!Pet.getAttributes().type.values.includes(type.toUpperCase())) {
    res.status(400).send({ message: 'Incorrect type provided' });
    return;
  }

  type = type.toUpperCase();

  let newPet: Pet;

  try {
    newPet = await createPet({ name, type, description, location });
  } catch (e) {
    console.error(e);
    // default option for status added to prevent crashing
    res.status(e.status || 400).send(e.message);
    return;
  }

  let newOwner: Owner;

  try {
    await owner.addPet(newPet);
    await owner.save();
    newOwner = await owner.reload();
  } catch (e) {
    console.error(e);
    res.status(e.status).send(e.message);
    return;
  }

  res.status(200).send(newPet);
});

router.patch('/update/:id?', async (req, res) => {
  const petId = req.params.id;
  req.body = trimValuesInObject(req.body);
  const { name, type, description, location } = req.body;

  // Check if the pet ID was provided
  if (!petId) {
    return res.status(400).send({ message: 'Pet ID not provided' });
  }

  if (type && !Pet.getAttributes().type.values.includes(type.trim().toUpperCase())) {
    res.status(400).send({ message: 'Incorrect type provided' });
    return;
  }

  // Check if the pet exists
  const pet = await getPet(petId);

  if (!pet) {
    return res.status(404).send({ message: 'Pet not found' });
  }

  // Update the pet
  try {
    await updatePet(petId, { name, type, description, location });
    await pet.reload();
  } catch (e) {
    console.error(e);
    return res.status(e.statusCode).send(e.message);
  }

  // Send the updated pet object in the response
  return res.status(200).send(pet);
});
