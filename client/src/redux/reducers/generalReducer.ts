import { Post } from '../../__generated__/graphql';
import { DEVELOPER_PANEL_OPEN, LOADING, ADDING_POST_TO_FEED, REPLACE_FEED } from '../constants';

const initialState: GeneralState = { loading: true, developerPanelOpen: false , feedPosts: []};

export interface GeneralState {
  loading: boolean;
  developerPanelOpen: boolean;
  feedPosts: Post[];
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
    case ADDING_POST_TO_FEED:
      return {
        ...state,
        feedPosts: [action.payload, ...state.feedPosts]
      }
    case REPLACE_FEED:
      return {
        ...state,
        feedPosts: action.payload
      }
    default:
      return state;
  }
};

export default generalReducer;
