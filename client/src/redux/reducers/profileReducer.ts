import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADD_PET, CURRENT_USER, LOGOUT, OWNER_DATA, PET_DATA, POST_DATA, REMOVE_PET, UPDATE_PET } from '../constants';
import { Owner, Pet, Post } from '../../__generated__/graphql';

const initialState: ProfileState = { owner: undefined, pets: [], currentUser: { id: '', isPet: false }, posts: [] };

export interface OwnerDAO {
  id: string;
  authId: string;
  username: string;
  name?: string;
  ProfilePicture?: any;
  location?: string;
  dateCreated?: Date;
  updateTimestamp?: Date;
  __typename: string;
}

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
  Snake = 'SNAKE',
}

export interface PetDAO {
  id: string;
  username: string;
  name: string;
  type: PetType;
  ProfilePicture?: any;
  description?: string;
  location?: string;
  dateCreated?: Date;
  updateTimestamp?: Date;
  __typename: string;
  OwnerPets?: any;
  posts: Post[];
}

export interface CurrentUser {
  id: string;
  isPet: boolean;
}

export interface ProfileState {
  owner: Owner | undefined;
  pets: Pet[];
  currentUser: CurrentUser;
  posts: Post[];
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
    case POST_DATA:
      return {
        ...state,
        posts: action.payload,
      };
    case CURRENT_USER:
      AsyncStorage.setItem('@currentUser', JSON.stringify(action.payload));
      return {
        ...state,
        currentUser: action.payload,
      };
    case ADD_PET:
      return { ...state, pets: [...state.pets, action.payload] };
    case UPDATE_PET:
      return {
        ...state,
        pets: state.pets.map((pet, i) => (pet.id === action.payload.id ? action.payload : pet)),
      };
    case REMOVE_PET:
      return { ...state, pets: state.pets.filter((store: any) => store.id !== action.payload) };

    case LOGOUT:
      AsyncStorage.removeItem('@token');
      return { ...initialState };
    default:
      return state;
  }
};

export default profileReducer;
