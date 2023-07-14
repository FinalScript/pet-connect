export const LikeTypeDef = `#graphql 
type Like {
    id: String!
    ownerId: String!
    postId: String!
}

type LikeResponse {
    like: Like
}

type UnlikeResponse {
    message: String!
}

type Mutation {
    likePost(postId: String!, ownerId: String!): LikeResponse!
    unlikePost(likeId: String!, postId: String!): UnlikeResponse!
}
`;
