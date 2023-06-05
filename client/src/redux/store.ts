import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import generalReducer from './reducers/generalReducer';

const rootReducer = combineReducers({
    general: generalReducer,
});

export const store = createStore(rootReducer);