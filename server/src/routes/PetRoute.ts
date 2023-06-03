import express from 'express';
import { getOwner } from '../controllers/OwnerController';
import { createPet, getPet, deletePet, updatePet } from '../controllers/PetController';
import { Pet, PetUpdateDAO } from '../models/Pet';
import { Owner } from '../models/Owner';
import { trimValuesInObject } from '../utils/trimValuesInObject';

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

router.post('/create', async (req, res) => {
  const authId = req.auth.payload.sub;
  req.body = trimValuesInObject(req.body);
  const { name, type, description, location } = req.body;
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

router.patch('/update/:id?', async (req, res) => {
  const petId = req.params.id;
  req.body = trimValuesInObject(req.body);
  const { name, type, description, location } = req.body;

  console.log(req.body)
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
