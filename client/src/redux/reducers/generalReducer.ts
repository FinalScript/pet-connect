import { DEVELOPER_PANEL_OPEN, LOADING } from '../constants';

const initialState: GeneralState = { loading: true, developerPanelOpen: false };

export interface GeneralState {
  loading: boolean;
  developerPanelOpen: boolean;
}
export interface GeneralReducer {
  general: GeneralState;
}

const generalReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case DEVELOPER_PANEL_OPEN:
      return { ...state, developerPanelOpen: action.payload };
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
