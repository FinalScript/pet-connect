import express from 'express';
import { getOwner } from '../controllers/OwnerController';
import { createPet } from '../controllers/PetController';
import { Pet } from '../models/Pet';
import { Owner } from '../models/Owner';
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
  const authId = req.auth.payload.sub;
  // Is changing this from a const to a let correct?
  let { name, type, description, location } = req.body;
  const owner = await getOwner(authId);

  // Should data values be trimmed? e.g trim leading or trailing spaces
  name = name.trim();
  type = type.trim().toUpperCase();

  if (!owner) {
    res.status(404).send('Owner does not exist');
    return;
  }

  if (!name) {
    res.status(400).send('Name missing');
    return;
  }

  if (!type) {
    res.status(400).send('Type missing');
    return;
  } else if (!Pet.getAttributes().type.values.includes(type)) {
    res.status(400).send('Incorrect type provided');
    return;
  }

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
