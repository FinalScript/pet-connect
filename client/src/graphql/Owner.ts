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
          url
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
          url
          path
          type
        }
      }
    }
  }
`);

export const SIGNUP = gql(`
  mutation Signup($username: String!, $name: String, $location: String, $profilePicture: MediaInput) {
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
          url
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
  mutation UpdateOwner($username: String, $name: String, $location: String, $profilePicture: MediaInput) {
    updateOwner(username: $username, name: $name, location: $location, profilePicture: $profilePicture) {
      name
      username
      location
      ProfilePicture {
        id
        name
        url
        path
        type
      }
    }
  }
`);
