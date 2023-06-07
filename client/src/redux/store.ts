import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import generalReducer from './reducers/generalReducer';
import profileReducer from './reducers/profileReducer';

const rootReducer = combineReducers({
  general: generalReducer,
  profile: profileReducer,
});

export const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
