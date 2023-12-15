import { merge } from 'lodash';
import { OwnerResolver } from './Owner';
import { PetResolver } from './Pet';
import { PostResolver } from './Post';
import { SearchResolver } from './Search';
import { CommentResolver } from './Comment';
import { GraphQLScalarType, Kind } from 'graphql';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: Date) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value: string | number | Date) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast: any) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

export const resolvers = merge(OwnerResolver, PetResolver, PostResolver, SearchResolver, CommentResolver, { Date: dateScalar });
