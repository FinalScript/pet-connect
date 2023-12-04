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
        author {
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
        author {
          id
          username
          name
          type
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

export const GET_POSTS_BY_PET_ID = gql(`
query getPostsByPetId($petId: String!) {
  getPostsByPetId(petId: $petId) {
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
      author {
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
}`);
