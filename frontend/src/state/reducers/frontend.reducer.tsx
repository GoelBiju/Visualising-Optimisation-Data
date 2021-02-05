import { NotificationPayload, NotificationType } from '../frontend.types';
import { FrontendState } from '../state.types';
import createReducer from './createReducer';

const initialState: FrontendState = {
    notifications: [],
};

export function handleNotification(state: FrontendState, payload: NotificationPayload): FrontendState {
    return {
        ...state,
        notifications: [payload.message],
    };
}

const FrontendReducer = createReducer(initialState, {
    [NotificationType]: handleNotification,
});

export default FrontendReducer;
