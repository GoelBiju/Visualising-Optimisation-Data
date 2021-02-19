import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers, Reducer } from "redux";
import commonReducer from "./common.reducer";

// Create the reducer
const FrontendCommonReducer = (history: History): Reducer =>
  combineReducers({
    router: connectRouter(history),
    frontend: commonReducer,
  });

export default FrontendCommonReducer;
