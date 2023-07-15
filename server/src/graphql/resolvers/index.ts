import { merge } from 'lodash';
import { OwnerResolver } from './Owner';
import { LikeResolver } from './Like';

export const resolvers = merge(OwnerResolver, LikeResolver);
