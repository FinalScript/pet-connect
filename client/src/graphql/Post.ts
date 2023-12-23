import { gql } from '../__generated__';

export const GET_ALL_POSTS = gql(`
  query GetAllPosts {
    getAllPosts {
      posts {
        id
        petId
        description
        likesCount
        createdAt
        updatedAt
        Media {
          id
          name
          url
          path
          type
          aspectRatio
        }
        Author {
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
          totalLikes
          ownerId
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
        likesCount
        createdAt
        updatedAt
        Media {
          id
          name
          url
          path
          type
          aspectRatio
        }
        Author {
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
          totalLikes
          ownerId
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
      likesCount
      createdAt
      updatedAt
      Media {
        id
        name
        url
        path
        type
        aspectRatio
      }
      Author {
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
        totalLikes
        ownerId
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
      likesCount
      createdAt
      updatedAt
      Media {
        id
        name
        url
        path
        type
        aspectRatio
      }
      Author {
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
        totalLikes
        ownerId
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
      likesCount
      createdAt
      updatedAt
      Media {
        id
        name
        url
        path
        type
        aspectRatio
      }
      Author {
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
        totalLikes
        ownerId
      }
    }
  }
`);

export const DELETE_POST = gql(`
  mutation DeletePost($id: String!) {
    deletePost(id: $id) {
      message
    }
  }
`);

export const LIKE_POST = gql(`
  mutation LikePost($id: String!) {
    likePost(id: $id) {
      success
    }
  }
`);

export const UNLIKE_POST = gql(`
  mutation UnlikePost($id: String!) {
    unlikePost(id: $id) {
      success
    }
  }
`);

export const IS_LIKING_POST = gql(`
  query IsLikingPost($id: String!) {
    isLikingPost(id: $id)
  }
`);

export const GET_LIKES_COUNT_OF_POST = gql(`
  query GetLikesCountOfPost($id: String!) {
    getPostById(id: $id) {
      post {
        likesCount
      }
    }
  }
`);
