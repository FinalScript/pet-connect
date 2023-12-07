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
          postsCount
          followerCount
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
          postsCount
          followerCount
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
}`);

export const GET_FOLLOWING = gql(`
  query GetFollowing {
    getFollowing {
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
`);

export const GET_FOR_YOU = gql(`
  query GetForYou {
    getForYou {
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
`);
