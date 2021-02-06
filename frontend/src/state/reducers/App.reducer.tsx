import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers, Reducer } from 'redux';
import frontendReducer from './frontend.reducer';

const AppReducer = (history: History): Reducer =>
    combineReducers({
        router: connectRouter(history),
        frontend: frontendReducer,
    });

export default AppReducer;
