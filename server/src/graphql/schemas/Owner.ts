import { Pet } from './../../models/Pet';

export const OwnerTypeDef = `#graphql
  type Owner {
    id: String!
    authId: String!
    name: String
    username: String!
    location: String
  }

  # For Queries

  type OwnerResponse {
    owner: Owner
    pets: [Pet]
  }

  type ValidateUsernameResponse {
    isAvailable: Boolean!
  }

  type VerifyTokenResponse {
    valid: Boolean!
  }

  # For Mutations

  type OwnerUpdatedResponse {
    name: String
    username: String
    location: String
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
    signup(username: String!, name: String, location: String): OwnerResponse!
    updateOwner(username: String, name: String, location: String): OwnerUpdatedResponse!
    deleteOwner: DeleteOwnerResponse!
  }
`;
