import { gql } from '../__generated__';

export const GET_OWNER = gql(`
  query GetOwner {
    getOwner {
      owner {
        id
        authId
        name
        username
        location
        ProfilePicture {
          id
          name
          path
          type
        }
      }
      pets {
        id
        username
        name
        type
        description
        location
        ProfilePicture {
          id
          name
          path
          type
        }
      }
    }
  }
`);

export const SIGNUP = gql(`
  mutation SignUp($username: String!, $name: String, $location: String, $profilePicture: Upload) {
    signup(username: $username, name: $name, location: $location, profilePicture: $profilePicture) {
      owner {
        id
        authId
        name
        username
        location
        ProfilePicture {
          id
          name
          path
          type
        }
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

export const UPDATE_OWNER = gql(`
  mutation UpdateOwner($username: String, $name: String, $location: String, $profilePicture: Upload) {
    updateOwner(username: $username, name: $name, location: $location, profilePicture: $profilePicture) {
      name
      username
      location
      ProfilePicture {
        id
        name
        path
        type
      }
    }
  }
`);
