export const PetTypeDef = `#graphql
    enum PetType {
        DOG
        CAT
        BIRD
        FISH
        RABBIT
        HAMSTER
        MOUSE 
        GUINEA_PIG
        HORSE
        SNAKE
        OTHER
    }

    type Pet {
        id: String!
        username: String!
        name: String!
        type: PetType!
        description: String
        location: String
        ProfilePicture: ProfilePicture
        Owner: Owner
    }
    
    type PetResponse {
        pet: Pet
    }

    type PetUpdatedResponse {
        username: String
        name: String
        type: PetType
        description: String
        location: String
        id: String 
        ProfilePicture: ProfilePicture
        OwnerId: String!
    }

    type ValidateUsernameResponse {
        isAvailable: Boolean!
    }

    type DeletePetResponse {
        message: String!
    }

    type Query {
        getPetById(id: String!): PetResponse!
        getPetByUsername(username: String!): PetResponse!
        validatePetUsername(username: String!): ValidateUsernameResponse!
    }

    type Mutation {
        createPet( username: String!, name: String!, type: PetType!, description: String, location: String, profilePicture: MediaInput ): PetResponse!
        updatePet( id: String, username: String, name: String, type: PetType, description: String, location: String, profilePicture: MediaInput ): PetUpdatedResponse!
        deletePet(id: String!): DeletePetResponse!
    }
    `;
