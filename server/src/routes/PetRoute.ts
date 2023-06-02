import express from 'express';
import { getOwner } from '../controllers/OwnerController';
import { createPet, getPet } from '../controllers/PetController';
import { Pet } from '../models/Pet';
import { Owner } from '../models/Owner';

const router = express.Router();

export { router as PetRouter };

router.get('/:id?', async (req, res) => {
  try {
    const petId = req.params.id;

    if (!petId) {
      res.status(400).send({ message: 'Id missing' });
      return;
    }

    const pet = await getPet(petId);

    if (pet) {
      res.send(pet);
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.status(404).send({ message: 'Pet not found' });
});

router.post('/create', async (req, res) => {
  const authId = req.auth.payload.sub;
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
  name = name.trim();

  if (!type) {
    res.status(400).send({ message: 'Type missing' });
    return;
  } else if (!Pet.getAttributes().type.values.includes(type.trim().toUpperCase())) {
    res.status(400).send({ message: 'Incorrect type provided' });
    return;
  }
  type = type.trim().toUpperCase();

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

  res.status(200).send(newOwner);
});
