import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';
import { connectToDB, sequelize } from './src/db/connection';
import { Owner } from './src/models/Owner';
import { Pet } from './src/models/Pet';
import type { ErrorRequestHandler } from 'express';
import { OwnerRouter } from './src/routes/OwnerRoute';
import { PetRouter } from './src/routes/PetRoute';
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: 'https://pet-app.com/api/v2',
  issuerBaseURL: `https://petapp.us.auth0.com/`,
  tokenSigningAlg: 'RS256',
});

const jwtErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  next();
};

// This route doesn't need authentication
app.get('/api/public', (req, res) => {
  res.json({
    message: "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication
app.use('/api/private/owner', checkJwt, OwnerRouter);

app.use('/api/private/pet', checkJwt, PetRouter);


app.use(jwtErrorHandler);

connectToDB().then(async () => {
  Owner.belongsToMany(Pet, { through: 'OwnerPets', onDelete: 'cascade', hooks: true });
  Pet.belongsToMany(Owner, { through: 'OwnerPets', onDelete: 'cascade', hooks: true });

  await sequelize.sync({ force: true });

  // // create pet and insert // .build for no insert
  // const tom = await Pet.create({ name: 'Tom', type: 'CAT' });
  // const jerry = await Pet.create({ name: 'Jerry', type: 'MOUSE' });

  // // create owner model and not insert
  // const ownerOne = Owner.build(
  //     {
  //         username: 'Aimen',
  //     },
  //     {
  //         include: [Pet],
  //     }
  // );

  // // create owner model and not insert
  // const ownerTwo = Owner.build(
  //     {
  //         username: 'Roynul',
  //     },
  //     {
  //         include: [Pet],
  //     }
  // );

  // // add pet association to  owner
  // ownerOne.addPet(tom);

  // // insert owner
  // await ownerOne.save();

  // ownerTwo.addPet(tom);
  // ownerTwo.addPet(jerry);

  // await ownerTwo.save();

  // // find query
  // const users = await Owner.findAll({
  //     attributes: ['username'],
  //     order: [['username', 'ASC']],
  //     include: { model: Pet, attributes: ['name'] },
  // });

  // const pets = await Pet.findAll({
  //     order: [['name', 'ASC']],
  // });

  // console.log('All users:', JSON.stringify(users, null, 2));
  // console.log('All pets:', JSON.stringify(pets, null, 2));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
