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
import { PostRouter } from './src/routes/PostRoute';
import { LikeRouter } from './src/routes/LikeRoute';
import { CommentRouter } from './src/routes/CommentRoute';
import { ProfilePicture } from './src/models/ProfilePicture';
import fs from 'fs';
import { Console } from 'console';
import { Post } from './src/models/Post';
import { Like } from './src/models/Like';
import { Comment } from './src/models/Comment';
dotenv.config();

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
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
    res.status(err.code === typeof Number ? err.code : 503).send({ message: err });
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

app.use('/api/private/post', checkJwt, PostRouter);

app.use('/api/private/like', checkJwt, LikeRouter);

app.use('/api/private/comment', checkJwt, CommentRouter);

app.use(jwtErrorHandler);

connectToDB().then(async () => {
  Owner.hasMany(Pet, { onDelete: 'cascade' });
  Pet.hasOne(ProfilePicture);

  Post.hasMany(Comment, {
    sourceKey: 'id',
    foreignKey: 'postId',
    as: 'comments',
  });

  Post.hasMany(Like, {
    sourceKey: 'id',
    foreignKey: 'postId',
    as: 'likes',
  });

  sequelize.sync({ force: true });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
