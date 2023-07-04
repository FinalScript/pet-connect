import { makeExecutableSchema } from '@graphql-tools/schema';
import { OwnerTypeDef } from './Owner';
import { resolvers } from '../resolvers';

export const schema = makeExecutableSchema({ typeDefs: [OwnerTypeDef], resolvers });
