import { gql } from '../__generated__';

export const GET_OWNER = gql(`
  query Query {
    getOwner {
      owner {
        id
        authId
        name
        username
        location
      }
      pets {
        id
        username
        name
        type
        description
        location
      }
    }
  }
`);

export const SIGNUP = gql(`
  mutation SignUp($username: String!, $name: String, $location: String) {
    signup(username: $username, name: $name, location: $location) {
      owner {
        id
        authId
        name
        username
        location
      }
    }
  }
`);

export const OWNER_USERNAME_EXISTS = gql(`
  query OwnerUsernameExists($username: String!) {
    validateUsername(username: $username) {
      isAvailable
    }
  }
`);
