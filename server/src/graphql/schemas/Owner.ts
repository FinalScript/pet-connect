export const OwnerTypeDef = `#graphql
  type Owner {
    id: String!
    authId: String!
    name: String
    username: String!
    location: String
  }

  type OwnerResponse {
    owner: Owner
  }

  type OwnerUpdatedResponse {
    name: String
    username: String
    location: String
  }

  type ValidateUsernameResponse {
    isAvailable: Boolean!
  }

  type DeleteOwnerResponse {
    message: String!
  }

  type Query {
    getOwner: OwnerResponse!
    validateUsername(username: String!): ValidateUsernameResponse!
  }

  type Mutation { 
    signup(username: String!, name: String, location: String): OwnerResponse!
    updateOwner(username: String, name: String, location: String): OwnerUpdatedResponse!
    deleteOwner: DeleteOwnerResponse!
  }
`;
