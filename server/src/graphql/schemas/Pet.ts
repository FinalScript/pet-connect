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
    }

    type ValidateUsernameResponse {
        isAvailable: Boolean!
    }

    type DeletePetResponse {
        message: String!
    }

    type Query{
        getPetById(id: String!): PetResponse!
        getPetByUsername(username: String!): PetResponse!
        validatePetUsername(username: String!): ValidateUsernameResponse!
    }

    type Mutation {
        createPet( username: String!, name: String!, type: PetType!, description: String, location: String ): PetResponse!
        updatePet( id: String, username: String, name: String, type: PetType, description: String, location: String ): PetUpdatedResponse!
        deletePet(id: String!): DeletePetResponse!
    }
    `;
