import { makeExecutableSchema } from '@graphql-tools/schema';
import { OwnerTypeDef } from './Owner';
import { resolvers } from '../resolvers';
import { PetTypeDef } from './Pet';
import { PostTypeDef } from './Post';
import { ProfilePictureTypeDef } from './ProfilePicture';
import { MediaTypeDef } from './Media';
import { SearchTypeDef } from './Search';
import { CommentTypeDef } from './Comment';

export const schema = makeExecutableSchema({
  typeDefs: [OwnerTypeDef, PetTypeDef, PostTypeDef, ProfilePictureTypeDef, MediaTypeDef, SearchTypeDef, CommentTypeDef],
  resolvers,
});
