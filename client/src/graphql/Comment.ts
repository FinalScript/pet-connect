import { gql } from '../__generated__';

export const GET_COMMENTS_BY_POST_ID = gql(`
  query GetCommentsByPostId($postId: String!) {
    getCommentsByPostId(postId: $postId) {
      id
      text
      ownerId
      postId
      createdAt
      updatedAt
      author {
        id
        authId
        name
        username
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

export const CREATE_COMMENT = gql(`
  mutation CreateComment($postId: String!, $text: String!) {
    createComment(postId: $postId, text: $text) {
      id
      text
      ownerId
      postId
      createdAt
      updatedAt
      author {
        id
        authId
        name
        username
        ProfilePicture {
          id
          name
          url
          path
          type
        }
        followingCount
      }
    }
  }
`);
