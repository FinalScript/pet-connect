import { merge } from 'lodash';
import { OwnerResolver } from './Owner';
import { LikeResolver } from './Like';
import { PetResolver } from './Pet';
import { Post } from '../../models/Post';
import { PostResolver } from './Post';

export const resolvers = merge(OwnerResolver, PetResolver, LikeResolver, PostResolver);
