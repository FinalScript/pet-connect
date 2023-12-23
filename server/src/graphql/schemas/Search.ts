export const SearchTypeDef = `#graphql
  
  type Results {
    owners: [Owner!]!
    pets: [Pet!]!
  }

  type SearchResponse {
    results: Results
  }

  # Query and Mutation definitions

  extend type Query {
    search(search: String!): SearchResponse!
  }
`;
