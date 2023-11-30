export const MediaTypeDef = `#graphql
  input MediaInput {
    name: String!
    url: String!
    path: String!
    type: String!
  }

  type Media {
    id: String!
    name: String!
    url: String!
    path: String!
    type: String!
  }
`;
