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
import { OwnerPets } from './src/models/OwnerPets';
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
  Owner.hasMany(Pet, { onDelete: 'cascade' });
  Pet.hasMany(Owner);

  await sequelize.sync({ force: true });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
