import express from 'express';
import { getOwner } from '../controllers/OwnerController';
import { createPet, getPet, deletePet, updatePet } from '../controllers/PetController';
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

router.delete('/delete/:id?', async (req, res) => {
  try {
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

    await deletePet(petId); 

    res.status(200).send({ message: 'Pet successfully deleted' });
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
  }
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

router.patch('/update/:id?', async (req, res) => {
  const authId = req.auth.payload.sub;
  const petId = req.params.id;
  const { name, type, description, location } = req.body;

  try {
    // Check if the owner exists
    const owner = await getOwner(authId);
    if (!owner) {
      return res.status(404).send({ message: 'Owner does not exist' });
    }

    // Check if the pet ID was provided
    if (!petId) {
      return res.status(400).send({ message: 'Pet ID not provided' });
    }

    // Check if the pet exists
    const pet = await getPet(petId);
    if (!pet) {
      return res.status(404).send({ message: 'Pet not found' });
    }

    // Check if any changes were made
    let hasChanges = false;

    // Update the pet's name if it has changed
    if (name !== undefined && name.trim() !== pet.name) {
      pet.name = name.trim();
      hasChanges = true;
    }

    // Update the pet's description if it has changed
    if (description !== undefined && description.trim() !== pet.description) {
      pet.description = description.trim();
      hasChanges = true;
    }

    // Update the pet's location if it has changed
    if (location !== undefined && location.trim() !== pet.location) {
      pet.location = location.trim();
      hasChanges = true;
    }

    // Check if the type has changed
    if (type !== undefined && type.trim().toUpperCase() !== pet.type) {
      const uppercaseType = type.trim().toUpperCase();
      if (!Pet.getAttributes().type.values.includes(uppercaseType)) {
        return res.status(400).send({ message: 'Incorrect type provided' });
      }
      pet.type = uppercaseType;
      hasChanges = true;
    }

    // If no changes were made
    if (!hasChanges) {
      return res.status(400).send({ message: 'No changes provided' });
    }

    // Update the pet
    try {
      await updatePet(petId, { name, type, description, location });
      await pet.save();
    } catch (e) {
      console.error(e);
      return res.status(e.status).send(e.message);
    }

    // Send the updated pet object in the response
    return res.status(200).send(pet);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});
