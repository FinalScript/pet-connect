import express from 'express';
import { getOwner } from '../controllers/OwnerController';
import { createPet } from '../controllers/PetController';
import { Pet } from '../models/Pet';
// import { Owner } from '../models/Owner';

const router = express.Router();

export { router as PetRouter };

router.get('/', async (req, res) => {
  const authId = req.auth.payload.sub;

  const owner = await getOwner(authId);

  if (owner) {
    res.send(owner);
    return;
  }

  res.status(404).send();
});

router.post('/create', async (req, res) => {
  console.log('In create');
  const authId = req.auth.payload.sub;
  const { name, type, description, location } = req.body;
  const owner = await getOwner(authId);

  if (!owner) {
    res.status(404).send('Owner missing');
    return;
  }
  if (!name) {
    res.status(400).send('Name missing');
    return;
  }

  if (!type) {
    res.status(400).send('Type missing');
    return;
  }

  let newPet: Pet;

  try {
    newPet = await createPet({ name, type, description, location });
  } catch (e) {
    console.error(e);
    res.status(e.status).send(e.message);
    return;
  }

  try {
    owner.addPet(newPet);
  } catch (e) {
    console.error(e);
    res.status(e.status).send(e.message);
    return;
  }
});
