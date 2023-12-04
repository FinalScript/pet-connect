import { gql } from '../__generated__';

export const CREATE_PET = gql(`
  mutation CreatePet($username: String!, $name: String!, $type: PetType!, $description: String, $location: String, $profilePicture: MediaInput) {
    createPet(username: $username, name: $name, type: $type, description: $description, location: $location, profilePicture: $profilePicture) {
      pet {
        id
        username
        name
        type
        description
        location
        OwnerId
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

export const PET_USERNAME_EXISTS = gql(`
  query PetUsernameExists($username: String!) {
    validatePetUsername(username: $username) {
      isAvailable
    }
  }
`);

export const UPDATE_PET = gql(`
  mutation UpdatePet($updatePetId: String, $username: String, $name: String, $type: PetType, $description: String, $location: String, $profilePicture: MediaInput) {
    updatePet(
      id: $updatePetId
      username: $username
      name: $name
      type: $type
      description: $description
      location: $location
      profilePicture: $profilePicture
    ) {
      username
      name
      type
      description
      location
      id
      OwnerId
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

export const DELETE_PET = gql(`
  mutation DeletePet($deletePetId: String!) {
    deletePet(id: $deletePetId) {
      message
    }
  }
`);