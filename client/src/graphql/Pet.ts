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
        ProfilePicture {
          id
          name
          url
          path
          type
        }
        Owner {
          id
          authId
          name
          username
          location
          followingCount
        }
        followerCount
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

export const GET_PET_BY_ID = gql(`
  query GetPetById($id: String!) {
    getPetById(id: $id) {
      pet {
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
        Owner {
          id
          authId
          name
          username
          location
          followingCount
        }
        followerCount
      }
    }
  }

`);

export const GET_PETS_BY_OWNER_ID = gql(`
  query GetPetsByOwnerId($id: String!) {
    getPetsByOwnerId(id: $id) {
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
        followerCount
      }
    }
  }

`);

export const IS_FOLLOWING_PET = gql(`
  query IsFollowingPet($ownerId: String!, $petId: String!) {
    isFollowingPet(ownerId: $ownerId, petId: $petId)
  }
`);

export const FOLLOW_PET = gql(`
  mutation FollowPet($id: String!) {
    followPet(id: $id) {
      success
    }
  }
`);

export const UNFOLOW_PET = gql(`
  mutation UnfollowPet($id: String!) {
    unfollowPet(id: $id) {
      success
    }
  }
`);
