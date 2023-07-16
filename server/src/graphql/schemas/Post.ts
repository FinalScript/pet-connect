export const PostTypeDef = `#graphql

type Post {
    id: String!
    petId: String!
    description: String
    media: [String!]!
}

type PostResponse {
    post: Post
}

type PostUpdatedResponse {
    petId: String
    description: String
    media: [String!]!
    id: String
}

type DeletePostResponse {
    message: String!
}

type Query{
    getPostById(id: String!): PostResponse!
    getPostsByPetId(petId: String!): PostResponse!
}

type Mutation {
    createPost( petId: String!, description: String, media: [String!]! ): PostResponse!
    updatePost( id: String, petId: String, description: String, media: [String!]! ): PostUpdatedResponse!
    deletePost( id: String! ): DeletePostResponse!
}

`;
