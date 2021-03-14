var _a;
import { __assign, __spreadArrays } from "tslib";
import * as log from "loglevel";
import { DataRequestType, DataType, DisconnectSocketSuccessType, FetchRunResultType, FetchRunsResultType, InitiateSocketSuccessType, LoadedSettingsType, LoadUrlsType, NotificationType, RegisterRouteType, SubscribedType, VisualisationNameType, } from "../actions/action.types";
import createReducer from "./createReducer";
export var initialState = {
    notifications: [],
    configuration: {
        plugins: [],
        urls: {
            backendUrl: "",
        },
        settingsLoaded: false,
        socket: null,
        subscribed: false,
    },
    runs: [],
    selectedRun: null,
    selectedVisualisation: "",
    data: null,
    fetchingData: false,
};
var updatePlugins = function (existingPlugins, payload) {
    if (!existingPlugins.some(function (p) { return p.link === payload.link; })) {
        return __spreadArrays(existingPlugins, [payload]);
    }
    log.error("Duplicate plugin route identified: " + payload.link + ". " + payload.plugin + ": '" + payload.displayName + " not registered");
    return existingPlugins;
};
export function handleNotification(state, payload) {
    return __assign(__assign({}, state), { notifications: [payload.message] });
}
export function handleRegisterPlugin(state, payload) {
    return __assign(__assign({}, state), { configuration: __assign(__assign({}, state.configuration), { plugins: updatePlugins(state.configuration.plugins, payload) }) });
}
export function handleLoadUrls(state, payload) {
    return __assign(__assign({}, state), { configuration: __assign(__assign({}, state.configuration), { urls: payload.urls }) });
}
export function handleLoadedSettings(state) {
    return __assign(__assign({}, state), { configuration: __assign(__assign({}, state.configuration), { settingsLoaded: true }) });
}
export function handleFetchRuns(state, payload) {
    return __assign(__assign({}, state), { runs: payload.runs });
}
export function handleFetchRun(state, payload) {
    return __assign(__assign({}, state), { selectedRun: payload.run, runs: [] });
}
export function handleVisualisationName(state, payload) {
    return __assign(__assign({}, state), { selectedVisualisation: payload.visualisationName });
}
export function handleInitiateSocket(state, payload) {
    return __assign(__assign({}, state), { configuration: __assign(__assign({}, state.configuration), { socket: payload.socket }) });
}
export function handleDisconnectSocket(state) {
    return __assign(__assign({}, state), { configuration: __assign(__assign({}, state.configuration), { socket: null }) });
}
export function handleSubscribed(state, payload) {
    return __assign(__assign({}, state), { configuration: __assign(__assign({}, state.configuration), { subscribed: payload.subscribed }) });
}
export function handleDataRequest(state) {
    return __assign(__assign({}, state), { fetchingData: true });
}
export function handleData(state, payload) {
    return __assign(__assign({}, state), { data: payload.data, fetchingData: false });
}
var CommonReducer = createReducer(initialState, (_a = {},
    _a[NotificationType] = handleNotification,
    _a[RegisterRouteType] = handleRegisterPlugin,
    _a[LoadUrlsType] = handleLoadUrls,
    _a[LoadedSettingsType] = handleLoadedSettings,
    _a[FetchRunsResultType] = handleFetchRuns,
    _a[FetchRunResultType] = handleFetchRun,
    _a[InitiateSocketSuccessType] = handleInitiateSocket,
    _a[DisconnectSocketSuccessType] = handleDisconnectSocket,
    _a[VisualisationNameType] = handleVisualisationName,
    _a[SubscribedType] = handleSubscribed,
    _a[DataRequestType] = handleDataRequest,
    _a[DataType] = handleData,
    _a));
export default CommonReducer;
//# sourceMappingURL=common.reducer.js.map