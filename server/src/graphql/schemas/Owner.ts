export const OwnerTypeDef = `#graphql
  scalar Upload

  type Owner {
    id: String!
    authId: String!
    name: String
    username: String!
    location: String
    ProfilePicture: ProfilePicture
  }

  # For Queries

  type OwnerResponse {
    owner: Owner!
    pets: [Pet!]!
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

  type Query {
    getOwner: OwnerResponse!
    validateUsername(username: String!): ValidateUsernameResponse!
    verifyToken: VerifyTokenResponse!
  }

  type Mutation { 
    signup(username: String!, name: String, location: String, profilePicture: Upload): SignUpResponse!
    updateOwner(username: String, name: String, location: String, profilePicture: Upload): OwnerUpdatedResponse!
    deleteOwner: DeleteOwnerResponse!
  }
`;
