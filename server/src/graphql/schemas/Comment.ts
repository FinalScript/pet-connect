export const CommentTypeDef = `#graphql 
type Comment {
    id: String!
    text: String!
    ownerId: String!
    postId: String
    author: Owner!
}

type Query{
    getCommentsByPostId(postId: String!): [Comment!]!
}

type Mutation {
    createComment(postId: String!, text:String!): Comment
}
`;
