export const PostTypeDef = `#graphql

type Post {
    id: String!
    petId: String!
    description: String
    Media: Media!
    Author: Pet
    Comments: [Comment!]
    likesCount: Int!
    createdAt: Date!
    updatedAt: Date!
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

type LikeResponse {
    newLikesCount: Int!
}

type Query{
    getAllPosts: AllPostsResponse! 
    getPostById(id: String!): PostResponse!
    getFollowing: [Post!]!
    getForYou: [Post!]!
    isLikingPost( id: String! ): Boolean!
}

type Mutation {
    createPost( petId: String!, description: String, media: MediaInput! ): PostResponse!
    updatePost( id: String,  description: String, media: MediaInput! ): PostUpdatedResponse!
    deletePost( id: String! ): DeletePostResponse!
    likePost( id: String! ): LikeResponse!
    unlikePost( id: String! ): LikeResponse!
}
`;
