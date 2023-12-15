import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { connectToDB, sequelize } from './src/db/connection';
import { schema } from './src/graphql/schemas/index';
import { Comment } from './src/models/Comment';
import { Media } from './src/models/Media';
import { Owner } from './src/models/Owner';
import { Pet } from './src/models/Pet';
import { Post } from './src/models/Post';
import { ProfilePicture } from './src/models/ProfilePicture';
import { OwnerRouter } from './src/routes/OwnerRoute';
import { PetRouter } from './src/routes/PetRoute';
import { Follows } from './src/models/Follow';

dotenv.config();

const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
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
  const graphqlUploadExress = (await import('graphql-upload/graphqlUploadExpress.mjs')).default;

  app.use(graphqlUploadExress());

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
    Owner.hasMany(Pet, { as: 'Pets', foreignKey: 'ownerId' });
    Pet.belongsTo(Owner, { as: 'Owner', foreignKey: 'ownerId' });

    Owner.belongsToMany(Pet, { through: Follows, as: 'FollowedPets', foreignKey: 'ownerId' });
    Owner.hasMany(Follows, { as: 'OwnerFollows', foreignKey: 'ownerId' });

    Pet.belongsToMany(Owner, { through: Follows, as: 'Followers', foreignKey: 'petId' });
    Pet.hasMany(Follows, { as: 'PetFollows', foreignKey: 'petId' });

    Pet.hasOne(ProfilePicture);
    Owner.hasOne(ProfilePicture);

    Pet.hasMany(Post, { as: 'Posts', foreignKey: 'petId' });

    Post.hasOne(Media, { as: 'Media' });
    Post.belongsTo(Pet, { as: 'author', foreignKey: 'petId' });

    Post.hasMany(Comment, {
      sourceKey: 'id',
      foreignKey: 'postId',
      as: 'Comments',
    });

    Post.hasMany(Owner, {
      as: 'Likes',
    });

    Owner.hasMany(Post, {
      foreignKey: 'ownerId',
      as: 'Likes',
    });

    Comment.belongsTo(Owner, { as: 'author' });

  });

  const port = process.env.PORT || 54321;

  await new Promise<void>((resolve) => app.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);

  app.get('/health', (req, res) => {
    res.status(200).send('Okay!');
  });

  app.use('/api/private/owner', checkJwt, OwnerRouter);

  app.use('/api/private/pet', checkJwt, PetRouter);

  app.use('/uploads', express.static('uploads'));
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
// app.use('/api/private/post', checkJwt, PostRouter);

// app.use('/api/private/like', checkJwt, LikeRouter);

// app.use('/api/private/comment', checkJwt, CommentRouter);

// app.use(jwtErrorHandler);
