import { merge } from 'lodash';
import { OwnerResolver } from './Owner';
import { LikeResolver } from './Like';
import { PetResolver } from './Pet';

export const resolvers = merge(OwnerResolver, PetResolver, LikeResolver);
