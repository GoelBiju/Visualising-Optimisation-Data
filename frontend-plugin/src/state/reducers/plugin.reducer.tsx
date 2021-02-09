// import { NotificationPayload, NotificationType, RegisterRoutePayload, RegisterRouteType } from '../frontend.types';
import { PluginState } from "../state.types";
import createReducer from "./createReducer";

const initialState: PluginState = {};

const FrontendReducer = createReducer(initialState, {});

export default FrontendReducer;
