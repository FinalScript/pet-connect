import { searchForOwners } from '../../controllers/OwnerController';
import { searchForPets } from '../../controllers/PetController';

export const SearchResolver = {
  Query: {
    search: async (_, { search }, context) => {
      const owners = await searchForOwners(search);
      const pets = await searchForPets(search);

      return { results: { owners, pets: pets } };
    },
  },
};
