export const OwnerTypeDef = `#graphql
  type Owner {
    id: String!
    authId: String!
    name: String
    username: String!
    location: String
    Pets: [Pet!]
    ProfilePicture: ProfilePicture
    Following: [Pet!]
    followingCount: Int
  }

  # For Queries

  type OwnerResponse {
    owner: Owner!
  }

  type ValidateUsernameResponse {
    isAvailable: Boolean!
  }

  type VerifyTokenResponse {
    valid: Boolean!
  }

  # For Mutations

  type SignUpResponse {
    owner: Owner!
  }

  type OwnerUpdatedResponse {
    name: String
    username: String
    location: String
    ProfilePicture: ProfilePicture
  }  

  type DeleteOwnerResponse {
    message: String!
  }

  # Query and Mutation definitions

  extend type Query {
    getOwner(authId: String): OwnerResponse!
    getOwnerById(id: String!): OwnerResponse!
    validateUsername(username: String!): ValidateUsernameResponse!
    verifyToken: VerifyTokenResponse!
  }

  extend type Mutation { 
    signup(username: String!, name: String, location: String, profilePicture: MediaInput): OwnerResponse!
    updateOwner(username: String, name: String, location: String, profilePicture: MediaInput): OwnerResponse!
    deleteOwner: DeleteOwnerResponse!
  }
`;
