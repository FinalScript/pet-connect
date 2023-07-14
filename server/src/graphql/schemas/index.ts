import { makeExecutableSchema } from '@graphql-tools/schema';
import { OwnerTypeDef } from './Owner';
import { resolvers } from '../resolvers';
import { LikeTypeDef } from './Like';

export const schema = makeExecutableSchema({ typeDefs: [OwnerTypeDef, LikeTypeDef], resolvers });
