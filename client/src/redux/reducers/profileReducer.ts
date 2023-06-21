import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADD_PET, CURRENT_USER, LOGOUT, OWNER_DATA, PET_DATA, REMOVE_PET } from '../constants';

const initialState: ProfileState = { owner: undefined, pets: [], currentUser: undefined };

export interface OwnerDAO {
  id: string;
  authId: string;
  username: string;
  name?: string;
  ProfilePicture?: any;
  description?: string;
  location?: string;
  dateCreated: Date;
  updateTimestamp: Date;
}

export interface PetDAO {
  id: string;
  username: string;
  name: string;
  type: 'DOG' | 'CAT' | 'BIRD' | 'FISH' | 'RABBIT' | 'HAMSTER' | 'REPTILE' | 'OTHER';
  ProfilePicture?: any;
  description?: string;
  location?: string;
  dateCreated: Date;
  updateTimestamp: Date;
  OwnerPets?: any;
}

export interface CurrentUser {
  id: string;
  isPet: boolean;
}

export interface ProfileState {
  owner: OwnerDAO | undefined;
  pets: PetDAO[];
  currentUser?: CurrentUser;
}

export interface ProfileReducer {
  profile: ProfileState;
}

type ProfileReducerFn = (state: ProfileState | undefined, action: any) => ProfileState;

const profileReducer: ProfileReducerFn = (state = initialState, action: any) => {
  switch (action.type) {
    case OWNER_DATA:
      return {
        ...state,
        owner: action.payload,
      };
    case PET_DATA:
      return {
        ...state,
        pets: action.payload,
      };
    case CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case ADD_PET:
      const copy = [...state.pets];

      copy.push(action.payload);

      return { ...state, pets: copy };

    case REMOVE_PET:
      return { ...state, storeData: state.pets.filter((store: any) => store.id !== action.payload) };

    case LOGOUT:
      AsyncStorage.removeItem('@token');
      return { ...initialState };
    default:
      return state;
  }
};

export default profileReducer;
