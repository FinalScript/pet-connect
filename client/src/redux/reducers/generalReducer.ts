import { LOADING } from '../constants';

const initialState: GeneralState = { loading: true };

export interface GeneralState {
  loading: boolean;
}

export interface GeneralReducer {
  general: GeneralState;
}

const generalReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default generalReducer;
