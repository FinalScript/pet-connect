import { gql } from '../__generated__';

export const SEARCH = gql(`
  query Search($search: String!) {
    search(search: $search) {
      results {
        owners {
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
          Pets {
            id
            username
            name
            type
            description
            location
          }
          FollowedPets {
            id
            username
            name
            type
            description
            location
          }
        }
        pets {
          id
          username
          name
          type
          description
          location
          Owner {
            id
            authId
            name
            username
            location
          }
          Followers {
            id
            authId
            name
            username
            location
          }
        }
      }
    }
  }
`);
