import { Post } from '../../__generated__/graphql';
import { DEVELOPER_PANEL_OPEN, LOADING, REPLACE_FOLLOWING_FEED, REPLACE_FORYOU_PAGE } from '../constants';

const initialState: GeneralState = { loading: true, developerPanelOpen: false, feed: { forYou: [], following: [] } };

export interface GeneralState {
  loading: boolean;
  developerPanelOpen: boolean;
  feed: Feed;
}

interface Feed {
  forYou: Post[];
  following: Post[];
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
    case REPLACE_FOLLOWING_FEED:
      return {
        ...state,
        feed: { ...state.feed, following: action.payload },
      };
    case REPLACE_FORYOU_PAGE:
      return {
        ...state,
        feed: { ...state.feed, forYou: action.payload },
      };
    default:
      return state;
  }
};

export default generalReducer;
