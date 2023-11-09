/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query VerifyToken {\n    verifyToken {\n      valid\n    }\n  }\n": types.VerifyTokenDocument,
    "\n  query GetOwner {\n    getOwner {\n      owner {\n        id\n        authId\n        name\n        username\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n      pets {\n        id\n        username\n        name\n        type\n        description\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n    }\n  }\n": types.GetOwnerDocument,
    "\n  mutation SignUp($username: String!, $name: String, $location: String, $profilePicture: Upload) {\n    signup(username: $username, name: $name, location: $location, profilePicture: $profilePicture) {\n      owner {\n        id\n        authId\n        name\n        username\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n    }\n  }\n": types.SignUpDocument,
    "\n  query OwnerUsernameExists($username: String!) {\n    validateUsername(username: $username) {\n      isAvailable\n    }\n  }\n": types.OwnerUsernameExistsDocument,
    "\n  mutation UpdateOwner($username: String, $name: String, $location: String, $profilePicture: Upload) {\n    updateOwner(username: $username, name: $name, location: $location, profilePicture: $profilePicture) {\n      name\n      username\n      location\n      ProfilePicture {\n        id\n        name\n        path\n        type\n      }\n    }\n  }\n": types.UpdateOwnerDocument,
    "\n  mutation CreatePet($username: String!, $name: String!, $type: PetType!, $description: String, $location: String, $profilePicture: Upload) {\n    createPet(username: $username, name: $name, type: $type, description: $description, location: $location, profilePicture: $profilePicture) {\n      pet {\n        id\n        username\n        name\n        type\n        description\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n    }\n  }\n": types.CreatePetDocument,
    "\n  query PetUsernameExists($username: String!) {\n    validatePetUsername(username: $username) {\n      isAvailable\n    }\n  }\n": types.PetUsernameExistsDocument,
    "\n  mutation Mutation($updatePetId: String, $username: String, $name: String, $type: PetType, $description: String, $location: String, $profilePicture: Upload) {\n    updatePet(\n      id: $updatePetId\n      username: $username\n      name: $name\n      type: $type\n      description: $description\n      location: $location\n      profilePicture: $profilePicture\n    ) {\n      username\n      name\n      type\n      description\n      location\n      id\n      ProfilePicture {\n        id\n        name\n        path\n        type\n      }\n    }\n  }\n": types.MutationDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query VerifyToken {\n    verifyToken {\n      valid\n    }\n  }\n"): (typeof documents)["\n  query VerifyToken {\n    verifyToken {\n      valid\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetOwner {\n    getOwner {\n      owner {\n        id\n        authId\n        name\n        username\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n      pets {\n        id\n        username\n        name\n        type\n        description\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOwner {\n    getOwner {\n      owner {\n        id\n        authId\n        name\n        username\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n      pets {\n        id\n        username\n        name\n        type\n        description\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SignUp($username: String!, $name: String, $location: String, $profilePicture: Upload) {\n    signup(username: $username, name: $name, location: $location, profilePicture: $profilePicture) {\n      owner {\n        id\n        authId\n        name\n        username\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp($username: String!, $name: String, $location: String, $profilePicture: Upload) {\n    signup(username: $username, name: $name, location: $location, profilePicture: $profilePicture) {\n      owner {\n        id\n        authId\n        name\n        username\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query OwnerUsernameExists($username: String!) {\n    validateUsername(username: $username) {\n      isAvailable\n    }\n  }\n"): (typeof documents)["\n  query OwnerUsernameExists($username: String!) {\n    validateUsername(username: $username) {\n      isAvailable\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateOwner($username: String, $name: String, $location: String, $profilePicture: Upload) {\n    updateOwner(username: $username, name: $name, location: $location, profilePicture: $profilePicture) {\n      name\n      username\n      location\n      ProfilePicture {\n        id\n        name\n        path\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateOwner($username: String, $name: String, $location: String, $profilePicture: Upload) {\n    updateOwner(username: $username, name: $name, location: $location, profilePicture: $profilePicture) {\n      name\n      username\n      location\n      ProfilePicture {\n        id\n        name\n        path\n        type\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePet($username: String!, $name: String!, $type: PetType!, $description: String, $location: String, $profilePicture: Upload) {\n    createPet(username: $username, name: $name, type: $type, description: $description, location: $location, profilePicture: $profilePicture) {\n      pet {\n        id\n        username\n        name\n        type\n        description\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePet($username: String!, $name: String!, $type: PetType!, $description: String, $location: String, $profilePicture: Upload) {\n    createPet(username: $username, name: $name, type: $type, description: $description, location: $location, profilePicture: $profilePicture) {\n      pet {\n        id\n        username\n        name\n        type\n        description\n        location\n        ProfilePicture {\n          id\n          name\n          path\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PetUsernameExists($username: String!) {\n    validatePetUsername(username: $username) {\n      isAvailable\n    }\n  }\n"): (typeof documents)["\n  query PetUsernameExists($username: String!) {\n    validatePetUsername(username: $username) {\n      isAvailable\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Mutation($updatePetId: String, $username: String, $name: String, $type: PetType, $description: String, $location: String, $profilePicture: Upload) {\n    updatePet(\n      id: $updatePetId\n      username: $username\n      name: $name\n      type: $type\n      description: $description\n      location: $location\n      profilePicture: $profilePicture\n    ) {\n      username\n      name\n      type\n      description\n      location\n      id\n      ProfilePicture {\n        id\n        name\n        path\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Mutation($updatePetId: String, $username: String, $name: String, $type: PetType, $description: String, $location: String, $profilePicture: Upload) {\n    updatePet(\n      id: $updatePetId\n      username: $username\n      name: $name\n      type: $type\n      description: $description\n      location: $location\n      profilePicture: $profilePicture\n    ) {\n      username\n      name\n      type\n      description\n      location\n      id\n      ProfilePicture {\n        id\n        name\n        path\n        type\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;