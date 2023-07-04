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

  type Query {
    getOwner: OwnerResponse!
  }

  type Mutation {
    signup(username: String!, name: String, location: String): OwnerResponse
    updateOwner(username: String, name: String, location: String): OwnerUpdatedResponse
  }
`;
