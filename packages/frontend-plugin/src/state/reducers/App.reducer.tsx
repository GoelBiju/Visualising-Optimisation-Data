import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers, Reducer } from "redux";
import pluginReducer from "./plugin.reducer";

const AppReducer = (history: History): Reducer =>
  combineReducers({
    router: connectRouter(history),
    plugin: pluginReducer,
  });

export default AppReducer;
