import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';
import { connectToDB, sequelize } from './src/db/connection';
import { Owner } from './src/models/Owner';
import { Pet } from './src/models/Pet';
import { ProfilePicture } from './src/models/ProfilePicture';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import { Post } from './src/models/Post';
import { Like } from './src/models/Like';
import { Comment } from './src/models/Comment';
import { ApolloServer } from '@apollo/server';
import { schema } from './src/graphql/schemas/index';
import fs from 'fs';
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

interface MyContext {
  token?: String;
}

const server = new ApolloServer<MyContext>({ schema });

const init = async () => {
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.authorization }),
    })
  );

  connectToDB().then(async () => {
    Owner.hasMany(Pet, { onDelete: 'cascade' });
    Pet.hasOne(ProfilePicture);
    Owner.hasOne(ProfilePicture);

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

    await sequelize.sync({ force: true });
    fs.rmSync('uploads/', { recursive: true, force: true });
  });

  const port = process.env.PORT || 3000;

  await new Promise<void>((resolve) => app.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
};

init();

// const jwtErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
//   if (err) {
//     console.log(err);
//     res.status(err.status === typeof Number ? err.status : 401).send({ message: err });
//     return;
//   }
//   next();
// };

// // This route doesn't need authentication
// app.get('/api/public', (req, res) => {
//   res.json({
//     message: "Hello from a public endpoint! You don't need to be authenticated to see this.",
//   });
// });

// // This route needs authentication
// app.use('/api/private/owner', checkJwt, OwnerRouter);

// app.use('/api/private/pet', checkJwt, PetRouter);

// app.get('/api/private/verifyToken', checkJwt, (req, res) => {
//   res.send();
// });

// app.use('/uploads', express.static('uploads'));

// app.use('/api/private/post', checkJwt, PostRouter);

// app.use('/api/private/like', checkJwt, LikeRouter);

// app.use('/api/private/comment', checkJwt, CommentRouter);

// app.use(jwtErrorHandler);
