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
        }
        pets {
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
  }
`);
