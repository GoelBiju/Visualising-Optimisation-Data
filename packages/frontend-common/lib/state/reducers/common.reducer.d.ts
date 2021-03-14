import { DataPayload, LoadUrlsPayload, NotificationPayload, RegisterRoutePayload, RunPayload, RunsPayload, SocketPayload, SubscribedPayload, VisualisationNamePayload } from "../actions/action.types";
import { FrontendState } from "../state.types";
export declare const initialState: FrontendState;
export declare function handleNotification(state: FrontendState, payload: NotificationPayload): FrontendState;
export declare function handleRegisterPlugin(state: FrontendState, payload: RegisterRoutePayload): FrontendState;
export declare function handleLoadUrls(state: FrontendState, payload: LoadUrlsPayload): FrontendState;
export declare function handleLoadedSettings(state: FrontendState): FrontendState;
export declare function handleFetchRuns(state: FrontendState, payload: RunsPayload): FrontendState;
export declare function handleFetchRun(state: FrontendState, payload: RunPayload): FrontendState;
export declare function handleVisualisationName(state: FrontendState, payload: VisualisationNamePayload): FrontendState;
export declare function handleInitiateSocket(state: FrontendState, payload: SocketPayload): FrontendState;
export declare function handleDisconnectSocket(state: FrontendState): FrontendState;
export declare function handleSubscribed(state: FrontendState, payload: SubscribedPayload): FrontendState;
export declare function handleDataRequest(state: FrontendState): FrontendState;
export declare function handleData(state: FrontendState, payload: DataPayload): FrontendState;
declare const CommonReducer: (state: FrontendState | undefined, action: import("./createReducer").Action) => FrontendState;
export default CommonReducer;
//# sourceMappingURL=common.reducer.d.ts.map