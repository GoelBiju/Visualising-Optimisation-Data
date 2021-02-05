import { combineReducers } from 'redux';
import frontendReducer from './frontend.reducer';

const AppReducer = combineReducers({
    frontend: frontendReducer,
});

export default AppReducer;
