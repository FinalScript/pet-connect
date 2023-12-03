import { makeExecutableSchema } from '@graphql-tools/schema';
import { OwnerTypeDef } from './Owner';
import { resolvers } from '../resolvers';
import { LikeTypeDef } from './Like';
import { PetTypeDef } from './Pet';
import { PostTypeDef } from './Post';
import { ProfilePictureTypeDef } from './ProfilePicture';
import { MediaTypeDef } from './Media';
import { SearchTypeDef } from './Search';

export const schema = makeExecutableSchema({
  typeDefs: [OwnerTypeDef, LikeTypeDef, PetTypeDef, PostTypeDef, ProfilePictureTypeDef, MediaTypeDef, SearchTypeDef],
  resolvers,
});
