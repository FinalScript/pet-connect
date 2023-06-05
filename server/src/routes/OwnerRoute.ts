import express from 'express';
import { createOwner, deleteOwner, getOwner, getOwnerByUsername, updateOwner } from '../controllers/OwnerController';
import { Owner } from '../models/Owner';
import { trimValuesInObject } from '../utils/trimValuesInObject';

const router = express.Router();

export { router as OwnerRouter };

router.get('/', async (req, res) => {
  const authId = req.auth.payload.sub;

  const owner = await getOwner(authId);

  if (owner) {
    res.send(owner);
    return;
  }

  res.status(404).send({ message: 'Account not found' });
});

router.post('/validateusername', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    res.status(400).send({ message: 'Please provide username' });
    return;
  }

  const owner = await getOwnerByUsername(username);

  if (owner) {
    res.status(409).send({ message: 'Username exists' });
    return;
  }

  res.status(200).send({ message: 'Username available' });
});

router.post('/signup', async (req, res) => {
  const authId = req.auth.payload.sub;
  const { name, username, location } = req.body;

  if (!username) {
    res.status(400).send({ message: 'Username missing' });
    return;
  }

  let newUser: Owner;

  try {
    newUser = await createOwner({ authId, username, name, location });
  } catch (e) {
    console.error(e);
    res.status(e.status).send({ message: e.message });
    return;
  }

  if (newUser) {
    res.status(200).send({ ...newUser, new: true });
    return;
  }

  res.status(500).send({ message: 'Error creating account' });
});

router.patch('/update/:authId?', async (req, res) => {
  const authId = req.params.authId;
  req.body = trimValuesInObject(req.body);
  const { name, username, location } = req.body;

  // Check if the account authID was provided
  if (!authId) {
    return res.status(404).send({ message: 'AuthId missing' });
  }

  // Check if the account exists
  const owner = await getOwner(authId);

  if (!owner) {
    return res.status(404).send({ message: 'Account not found' });
  }

  // Update the account
  try {
    await updateOwner(authId, { name, username, location });
    await owner.reload();
  } catch (e) {
    console.error(e);
    return res.status(e.statusCode).send({ message: e.message });
  }

  // Send the updated account object in the response
  return res.status(200).send(owner);
});

router.delete('/delete/:authId?', async (req, res) => {
  const authId = req.params.authId;

  if (!authId) {
    res.status(400).send({ message: 'AuthId missing' });
    return;
  }

  const owner = await getOwner(authId);

  if (!owner) {
    res.status(404).send({ message: 'Account not found' });
    return;
  }

  try {
    await deleteOwner(authId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
  }

  res.status(200).send({ message: 'Account successfully deleted' });
});
