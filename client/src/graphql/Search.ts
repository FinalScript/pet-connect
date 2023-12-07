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
          followingCount
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
            followingCount
          }
          ProfilePicture {
            id
            name
            url
            path
            type
          }
          postsCount
          followerCount
        }
      }
    }
  }
`);
