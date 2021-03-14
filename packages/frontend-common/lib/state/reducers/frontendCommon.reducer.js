import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import commonReducer from "./common.reducer";
// Create the reducer
var FrontendCommonReducer = function (history) {
    return combineReducers({
        router: connectRouter(history),
        frontend: commonReducer,
    });
};
export default FrontendCommonReducer;
//# sourceMappingURL=frontendCommon.reducer.js.map