import { NotificationPayload, NotificationType, RegisterRouteType } from '../frontend.types';
import { FrontendState } from '../state.types';
import createReducer from './createReducer';

const initialState: FrontendState = {
    notifications: [],
    plugins: [],
};

export function handleNotification(state: FrontendState, payload: NotificationPayload): FrontendState {
    return {
        ...state,
        notifications: [payload.message],
    };
}

export function handleRegisterPlugin(state: FrontendState, payload: RegisterPluginPayload): FrontendState {
    const newPlugins = state.plugins.slice();
    newPlugins.push(payload);

    return {
        ...state,
        plugins: newPlugins,
    };
}

const FrontendReducer = createReducer(initialState, {
    [NotificationType]: handleNotification,
    [RegisterRouteType]: handleRegisterPlugin,
});

export default FrontendReducer;
