import { merge } from 'lodash';
import { LikeResolver } from './Like';
import { OwnerResolver } from './Owner';
import { PetResolver } from './Pet';
import { PostResolver } from './Post';
import { SearchResolver } from './Search';
import { CommentResolver } from './Comment';

export const resolvers = merge(OwnerResolver, PetResolver, LikeResolver, PostResolver, SearchResolver, CommentResolver);
