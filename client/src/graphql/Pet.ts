import { gql } from '../__generated__';

export const CREATE_PET = gql(`
  mutation CreatePet($username: String!, $name: String!, $type: PetType!, $description: String, $location: String) {
    createPet(username: $username, name: $name, type: $type, description: $description, location: $location) {
      pet {
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

export const PET_USERNAME_EXISTS = gql(`
  query PetUsernameExists($username: String!) {
    validatePetUsername(username: $username) {
      isAvailable
    }
  }
`);
