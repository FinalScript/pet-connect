import { gql } from '../__generated__';

export const GET_ALL_POSTS = gql(`
  query GetAllPosts {
    getAllPosts {
      posts {
        id
        petId
        description
        Media {
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

export const CREATE_POST = gql(`
  mutation CreatePost($petId: String!, $media: MediaInput!, $description: String) {
    createPost(petId: $petId, media: $media, description: $description) {
      post {
        id
        petId
        description
        Media {
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
