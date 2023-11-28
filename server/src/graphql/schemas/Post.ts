export const PostTypeDef = `#graphql

type Post {
    id: String!
    petId: String!
    description: String
    media: Media!
}

type PostResponse {
    post: Post
}

type PostUpdatedResponse {
    petId: String
    description: String
    media: Media!
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
    createPost( petId: String!, description: String, media: Upload! ): PostResponse!
    updatePost( id: String,  description: String, media: Upload! ): PostUpdatedResponse!
    deletePost( id: String! ): DeletePostResponse!
}

`;
