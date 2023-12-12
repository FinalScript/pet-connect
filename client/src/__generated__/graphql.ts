/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AllPostsResponse = {
  __typename?: 'AllPostsResponse';
  posts: Array<Post>;
};

export type DeleteOwnerResponse = {
  __typename?: 'DeleteOwnerResponse';
  message: Scalars['String']['output'];
};

export type DeletePetResponse = {
  __typename?: 'DeletePetResponse';
  message: Scalars['String']['output'];
};

export type DeletePostResponse = {
  __typename?: 'DeletePostResponse';
  message: Scalars['String']['output'];
};

export type FollowPetResponse = {
  __typename?: 'FollowPetResponse';
  success: Scalars['Boolean']['output'];
};

export type Like = {
  __typename?: 'Like';
  id: Scalars['String']['output'];
  ownerId: Scalars['String']['output'];
  postId: Scalars['String']['output'];
};

export type LikeResponse = {
  __typename?: 'LikeResponse';
  like?: Maybe<Like>;
};

export type Media = {
  __typename?: 'Media';
  aspectRatio: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type MediaInput = {
  aspectRatio: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  path: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPet: PetResponse;
  createPost: PostResponse;
  deleteOwner: DeleteOwnerResponse;
  deletePet: DeletePetResponse;
  deletePost: DeletePostResponse;
  followPet: FollowPetResponse;
  likePost: LikeResponse;
  signup: SignUpResponse;
  unfollowPet: FollowPetResponse;
  unlikePost: UnlikeResponse;
  updateOwner: OwnerUpdatedResponse;
  updatePet: PetUpdatedResponse;
  updatePost: PostUpdatedResponse;
};


export type MutationCreatePetArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  profilePicture?: InputMaybe<MediaInput>;
  type: PetType;
  username: Scalars['String']['input'];
};


export type MutationCreatePostArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  media: MediaInput;
  petId: Scalars['String']['input'];
};


export type MutationDeletePetArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePostArgs = {
  id: Scalars['String']['input'];
};


export type MutationFollowPetArgs = {
  id: Scalars['String']['input'];
};


export type MutationLikePostArgs = {
  ownerId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<MediaInput>;
  username: Scalars['String']['input'];
};


export type MutationUnfollowPetArgs = {
  id: Scalars['String']['input'];
};


export type MutationUnlikePostArgs = {
  likeId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationUpdateOwnerArgs = {
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<MediaInput>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdatePetArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<MediaInput>;
  type?: InputMaybe<PetType>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdatePostArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  media: MediaInput;
};

export type Owner = {
  __typename?: 'Owner';
  ProfilePicture?: Maybe<ProfilePicture>;
  authId: Scalars['String']['output'];
  followingCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  location?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type OwnerResponse = {
  __typename?: 'OwnerResponse';
  owner: Owner;
};

export type OwnerUpdatedResponse = {
  __typename?: 'OwnerUpdatedResponse';
  ProfilePicture?: Maybe<ProfilePicture>;
  location?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type Pet = {
  __typename?: 'Pet';
  Owner?: Maybe<Owner>;
  ProfilePicture?: Maybe<ProfilePicture>;
  description?: Maybe<Scalars['String']['output']>;
  followerCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  location?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  ownerId?: Maybe<Scalars['String']['output']>;
  postsCount?: Maybe<Scalars['Int']['output']>;
  type: PetType;
  username: Scalars['String']['output'];
};

export type PetResponse = {
  __typename?: 'PetResponse';
  pet?: Maybe<Pet>;
};

export enum PetType {
  Bird = 'BIRD',
  Cat = 'CAT',
  Dog = 'DOG',
  Fish = 'FISH',
  GuineaPig = 'GUINEA_PIG',
  Hamster = 'HAMSTER',
  Horse = 'HORSE',
  Mouse = 'MOUSE',
  Other = 'OTHER',
  Rabbit = 'RABBIT',
  Snake = 'SNAKE'
}

export type PetUpdatedResponse = {
  __typename?: 'PetUpdatedResponse';
  OwnerId: Scalars['String']['output'];
  ProfilePicture?: Maybe<ProfilePicture>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  type?: Maybe<PetType>;
  username?: Maybe<Scalars['String']['output']>;
};

export type PetsResponse = {
  __typename?: 'PetsResponse';
  pets: Array<Pet>;
};

export type Post = {
  __typename?: 'Post';
  Media: Media;
  author: Pet;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  petId: Scalars['String']['output'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  post?: Maybe<Post>;
};

export type PostUpdatedResponse = {
  __typename?: 'PostUpdatedResponse';
  Media?: Maybe<Media>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  petId?: Maybe<Scalars['String']['output']>;
};

export type PostsResponse = {
  __typename?: 'PostsResponse';
  posts: Array<Post>;
};

export type ProfilePicture = {
  __typename?: 'ProfilePicture';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getAllPosts: AllPostsResponse;
  getFollowersByPetId: Array<Owner>;
  getFollowing: Array<Post>;
  getFollowingByOwnerId: Array<Pet>;
  getForYou: Array<Post>;
  getOwner: OwnerResponse;
  getOwnerById: OwnerResponse;
  getPetById: PetResponse;
  getPetByUsername: PetResponse;
  getPetsByOwnerId: PetsResponse;
  getPostById: PostResponse;
  getPostsByPetId: PostsResponse;
  isFollowingPet: Scalars['Boolean']['output'];
  search: SearchResponse;
  validatePetUsername: ValidateUsernameResponse;
  validateUsername: ValidateUsernameResponse;
  verifyToken: VerifyTokenResponse;
};


export type QueryGetFollowersByPetIdArgs = {
  petId: Scalars['String']['input'];
};


export type QueryGetFollowingByOwnerIdArgs = {
  ownerId: Scalars['String']['input'];
};


export type QueryGetOwnerByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPetByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPetByUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryGetPetsByOwnerIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPostByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPostsByPetIdArgs = {
  petId: Scalars['String']['input'];
};


export type QueryIsFollowingPetArgs = {
  ownerId: Scalars['String']['input'];
  petId: Scalars['String']['input'];
};


export type QuerySearchArgs = {
  search: Scalars['String']['input'];
};


export type QueryValidatePetUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryValidateUsernameArgs = {
  username: Scalars['String']['input'];
};

export type Results = {
  __typename?: 'Results';
  owners: Array<Owner>;
  pets: Array<Pet>;
};

export type SearchResponse = {
  __typename?: 'SearchResponse';
  results?: Maybe<Results>;
};

export type SignUpResponse = {
  __typename?: 'SignUpResponse';
  owner: Owner;
};

export type UnlikeResponse = {
  __typename?: 'UnlikeResponse';
  message: Scalars['String']['output'];
};

export type ValidateUsernameResponse = {
  __typename?: 'ValidateUsernameResponse';
  isAvailable: Scalars['Boolean']['output'];
};

export type VerifyTokenResponse = {
  __typename?: 'VerifyTokenResponse';
  valid: Scalars['Boolean']['output'];
};

export type VerifyTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type VerifyTokenQuery = { __typename?: 'Query', verifyToken: { __typename?: 'VerifyTokenResponse', valid: boolean } };

export type GetOwnerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOwnerQuery = { __typename?: 'Query', getOwner: { __typename?: 'OwnerResponse', owner: { __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null } } };

export type GetFollowingByOwnerIdQueryVariables = Exact<{
  ownerId: Scalars['String']['input'];
}>;


export type GetFollowingByOwnerIdQuery = { __typename?: 'Query', getFollowingByOwnerId: Array<{ __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, followerCount?: number | null, postsCount?: number | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null, Owner?: { __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null } | null }> };

export type GetOwnerByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetOwnerByIdQuery = { __typename?: 'Query', getOwnerById: { __typename?: 'OwnerResponse', owner: { __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null } } };

export type SignupMutationVariables = Exact<{
  username: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<MediaInput>;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'SignUpResponse', owner: { __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null } } };

export type OwnerUsernameExistsQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type OwnerUsernameExistsQuery = { __typename?: 'Query', validateUsername: { __typename?: 'ValidateUsernameResponse', isAvailable: boolean } };

export type UpdateOwnerMutationVariables = Exact<{
  username?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<MediaInput>;
}>;


export type UpdateOwnerMutation = { __typename?: 'Mutation', updateOwner: { __typename?: 'OwnerUpdatedResponse', name?: string | null, username?: string | null, location?: string | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null } };

export type CreatePetMutationVariables = Exact<{
  username: Scalars['String']['input'];
  name: Scalars['String']['input'];
  type: PetType;
  description?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<MediaInput>;
}>;


export type CreatePetMutation = { __typename?: 'Mutation', createPet: { __typename?: 'PetResponse', pet?: { __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, postsCount?: number | null, followerCount?: number | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null, Owner?: { __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null } | null } | null } };

export type PetUsernameExistsQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type PetUsernameExistsQuery = { __typename?: 'Query', validatePetUsername: { __typename?: 'ValidateUsernameResponse', isAvailable: boolean } };

export type UpdatePetMutationVariables = Exact<{
  updatePetId?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<PetType>;
  description?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<MediaInput>;
}>;


export type UpdatePetMutation = { __typename?: 'Mutation', updatePet: { __typename?: 'PetUpdatedResponse', username?: string | null, name?: string | null, type?: PetType | null, description?: string | null, location?: string | null, id?: string | null, OwnerId: string, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null } };

export type DeletePetMutationVariables = Exact<{
  deletePetId: Scalars['String']['input'];
}>;


export type DeletePetMutation = { __typename?: 'Mutation', deletePet: { __typename?: 'DeletePetResponse', message: string } };

export type GetPetByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetPetByIdQuery = { __typename?: 'Query', getPetById: { __typename?: 'PetResponse', pet?: { __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, followerCount?: number | null, postsCount?: number | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null, Owner?: { __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null } | null } | null } };

export type GetPetsByOwnerIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetPetsByOwnerIdQuery = { __typename?: 'Query', getPetsByOwnerId: { __typename?: 'PetsResponse', pets: Array<{ __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, postsCount?: number | null, followerCount?: number | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null }> } };

export type GetFollowersByPetIdQueryVariables = Exact<{
  petId: Scalars['String']['input'];
}>;


export type GetFollowersByPetIdQuery = { __typename?: 'Query', getFollowersByPetId: Array<{ __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null }> };

export type IsFollowingPetQueryVariables = Exact<{
  ownerId: Scalars['String']['input'];
  petId: Scalars['String']['input'];
}>;


export type IsFollowingPetQuery = { __typename?: 'Query', isFollowingPet: boolean };

export type FollowPetMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type FollowPetMutation = { __typename?: 'Mutation', followPet: { __typename?: 'FollowPetResponse', success: boolean } };

export type UnfollowPetMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type UnfollowPetMutation = { __typename?: 'Mutation', unfollowPet: { __typename?: 'FollowPetResponse', success: boolean } };

export type GetAllPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPostsQuery = { __typename?: 'Query', getAllPosts: { __typename?: 'AllPostsResponse', posts: Array<{ __typename?: 'Post', id: string, petId: string, description?: string | null, Media: { __typename?: 'Media', id: string, name: string, url: string, path: string, type?: string | null, aspectRatio: number }, author: { __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, postsCount?: number | null, followerCount?: number | null, ownerId?: string | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null, Owner?: { __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null } | null } }> } };

export type CreatePostMutationVariables = Exact<{
  petId: Scalars['String']['input'];
  media: MediaInput;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostResponse', post?: { __typename?: 'Post', id: string, petId: string, description?: string | null, Media: { __typename?: 'Media', id: string, name: string, url: string, path: string, type?: string | null, aspectRatio: number }, author: { __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, postsCount?: number | null, followerCount?: number | null, ownerId?: string | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null, Owner?: { __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null } | null } } | null } };

export type GetPostsByPetIdQueryVariables = Exact<{
  petId: Scalars['String']['input'];
}>;


export type GetPostsByPetIdQuery = { __typename?: 'Query', getPostsByPetId: { __typename?: 'PostsResponse', posts: Array<{ __typename?: 'Post', id: string, petId: string, description?: string | null, Media: { __typename?: 'Media', id: string, name: string, url: string, path: string, type?: string | null, aspectRatio: number }, author: { __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, postsCount?: number | null, followerCount?: number | null, ownerId?: string | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null } }> } };

export type GetFollowingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFollowingQuery = { __typename?: 'Query', getFollowing: Array<{ __typename?: 'Post', id: string, petId: string, description?: string | null, Media: { __typename?: 'Media', id: string, name: string, url: string, path: string, type?: string | null, aspectRatio: number }, author: { __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, postsCount?: number | null, followerCount?: number | null, ownerId?: string | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null } }> };

export type GetForYouQueryVariables = Exact<{ [key: string]: never; }>;


export type GetForYouQuery = { __typename?: 'Query', getForYou: Array<{ __typename?: 'Post', id: string, petId: string, description?: string | null, Media: { __typename?: 'Media', id: string, name: string, url: string, path: string, type?: string | null, aspectRatio: number }, author: { __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, postsCount?: number | null, followerCount?: number | null, ownerId?: string | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null } }> };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: { __typename?: 'DeletePostResponse', message: string } };

export type SearchQueryVariables = Exact<{
  search: Scalars['String']['input'];
}>;


export type SearchQuery = { __typename?: 'Query', search: { __typename?: 'SearchResponse', results?: { __typename?: 'Results', owners: Array<{ __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null }>, pets: Array<{ __typename?: 'Pet', id: string, username: string, name: string, type: PetType, description?: string | null, location?: string | null, postsCount?: number | null, followerCount?: number | null, Owner?: { __typename?: 'Owner', id: string, authId: string, name?: string | null, username: string, location?: string | null, followingCount?: number | null } | null, ProfilePicture?: { __typename?: 'ProfilePicture', id: string, name: string, url: string, path: string, type: string } | null }> } | null } };


export const VerifyTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VerifyToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valid"}}]}}]}}]} as unknown as DocumentNode<VerifyTokenQuery, VerifyTokenQueryVariables>;
export const GetOwnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetOwnerQuery, GetOwnerQueryVariables>;
export const GetFollowingByOwnerIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowingByOwnerId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ownerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFollowingByOwnerId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ownerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ownerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]} as unknown as DocumentNode<GetFollowingByOwnerIdQuery, GetFollowingByOwnerIdQueryVariables>;
export const GetOwnerByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOwnerById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOwnerById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetOwnerByIdQuery, GetOwnerByIdQueryVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const OwnerUsernameExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OwnerUsernameExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}}]}}]}}]} as unknown as DocumentNode<OwnerUsernameExistsQuery, OwnerUsernameExistsQueryVariables>;
export const UpdateOwnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOwner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOwnerMutation, UpdateOwnerMutationVariables>;
export const CreatePetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PetType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePetMutation, CreatePetMutationVariables>;
export const PetUsernameExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PetUsernameExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validatePetUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}}]}}]}}]} as unknown as DocumentNode<PetUsernameExistsQuery, PetUsernameExistsQueryVariables>;
export const UpdatePetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updatePetId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PetType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updatePetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"OwnerId"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePetMutation, UpdatePetMutationVariables>;
export const DeletePetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deletePetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletePetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeletePetMutation, DeletePetMutationVariables>;
export const GetPetByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPetById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPetById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetPetByIdQuery, GetPetByIdQueryVariables>;
export const GetPetsByOwnerIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPetsByOwnerId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPetsByOwnerId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetPetsByOwnerIdQuery, GetPetsByOwnerIdQueryVariables>;
export const GetFollowersByPetIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowersByPetId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"petId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFollowersByPetId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"petId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"petId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}}]}}]} as unknown as DocumentNode<GetFollowersByPetIdQuery, GetFollowersByPetIdQueryVariables>;
export const IsFollowingPetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IsFollowingPet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ownerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"petId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isFollowingPet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ownerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ownerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"petId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"petId"}}}]}]}}]} as unknown as DocumentNode<IsFollowingPetQuery, IsFollowingPetQueryVariables>;
export const FollowPetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FollowPet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followPet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<FollowPetMutation, FollowPetMutationVariables>;
export const UnfollowPetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnfollowPet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unfollowPet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UnfollowPetMutation, UnfollowPetMutationVariables>;
export const GetAllPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"Media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllPostsQuery, GetAllPostsQueryVariables>;
export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"petId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"media"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"petId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"petId"}}},{"kind":"Argument","name":{"kind":"Name","value":"media"},"value":{"kind":"Variable","name":{"kind":"Name","value":"media"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"Media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const GetPostsByPetIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPostsByPetId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"petId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPostsByPetId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"petId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"petId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"Media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPostsByPetIdQuery, GetPostsByPetIdQueryVariables>;
export const GetFollowingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFollowing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"Media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}}]}}]}}]}}]} as unknown as DocumentNode<GetFollowingQuery, GetFollowingQueryVariables>;
export const GetForYouDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetForYou"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getForYou"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"petId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"Media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}}]}}]}}]}}]} as unknown as DocumentNode<GetForYouQuery, GetForYouQueryVariables>;
export const DeletePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeletePostMutation, DeletePostMutationVariables>;
export const SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Search"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"Owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ProfilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchQuery, SearchQueryVariables>;