export const PostTypeDef = `#graphql

type Post {
    id: String!
    petId: String!
    description: String
    Media: Media!
    author: Pet!
}

type AllPostsResponse {
    posts: [Post!]!
}

type PostResponse {
    post: Post
}

type PostsResponse {
    posts: [Post!]!
}

type PostUpdatedResponse {
    petId: String
    description: String
    Media: Media
    id: String
}

type DeletePostResponse {
    message: String!
}

type Query{
    getAllPosts: AllPostsResponse! 
    getPostById(id: String!): PostResponse!
    getPostsByPetId(petId: String!): PostsResponse!
    getFollowing: [Post!]!
    getForYou: [Post!]!
}

type Mutation {
    createPost( petId: String!, description: String, media: MediaInput! ): PostResponse!
    updatePost( id: String,  description: String, media: MediaInput! ): PostUpdatedResponse!
    deletePost( id: String! ): DeletePostResponse!
}
`;
