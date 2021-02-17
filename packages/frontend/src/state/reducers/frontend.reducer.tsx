import * as log from 'loglevel';
import { NotificationPayload, NotificationType, RegisterRoutePayload, RegisterRouteType } from '../frontend.types';
import { FrontendState } from '../state.types';
import createReducer from './createReducer';

const initialState: FrontendState = {
    notifications: [],
    plugins: [],
};

const updatePlugins = (
    existingPlugins: RegisterRoutePayload[],
    payload: RegisterRoutePayload,
): RegisterRoutePayload[] => {
    if (!existingPlugins.some((p) => p.link === payload.link)) {
        return [...existingPlugins, payload];
    }

    log.error(
        `Duplicate plugin route identified: ${payload.link}. ${payload.plugin}: '${payload.displayName} not registered`,
    );
    return existingPlugins;
};

export function handleNotification(state: FrontendState, payload: NotificationPayload): FrontendState {
    return {
        ...state,
        notifications: [payload.message],
    };
}

export function handleRegisterPlugin(state: FrontendState, payload: RegisterRoutePayload): FrontendState {
    return {
        ...state,
        plugins: updatePlugins(state.plugins, payload),
    };
}

const FrontendReducer = createReducer(initialState, {
    [NotificationType]: handleNotification,
    [RegisterRouteType]: handleRegisterPlugin,
});

export default FrontendReducer;
