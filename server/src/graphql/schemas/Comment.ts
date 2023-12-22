export const CommentTypeDef = `#graphql 
scalar Date

type Comment {
    id: String!
    text: String!
    ownerId: String!
    postId: String
    Author: Owner!
    createdAt: Date!
    updatedAt: Date!
}

type Query{
    getCommentsByPostId(postId: String!): [Comment!]!
}

type Mutation {
    createComment(postId: String!, text:String!): Comment
}
`;
