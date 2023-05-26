import express from 'express';
import { createOwner, getOwner } from '../controllers/OwnerController';
import { Owner } from '../models/Owner';

const router = express.Router();

export { router as OwnerRouter };

router.get('/', async (req, res) => {
  const authId = req.auth.payload.sub;

  const owner = await getOwner(authId);

  if (owner) {
    res.send(owner);
    return;
  }

  res.status(404).send();
});

router.post('/signup', async (req, res) => {
  const authId = req.auth.payload.sub;
  const { name, username, location } = req.body;

  if (!username) {
    res.status(400).send('Username missing');
    return;
  }

  let newUser: Owner;

  try {
    newUser = await createOwner({ authId, username, name, location });
  } catch (e) {
    console.error(e);
    res.status(e.status).send(e.message);
    return;
  }

  if (newUser) {
    res.status(200).send({ ...newUser, new: true });
    return;
  }

  res.status(500).send('Error creating account');
});
