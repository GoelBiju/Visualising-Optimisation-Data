import axios from 'axios';
import { NotificationPayload, NotificationType } from '../frontend.types';
import { ActionType, ThunkResult } from '../state.types';

export const frontendNotification = (message: string): ActionType<NotificationPayload> => ({
    type: NotificationType,
    payload: {
        message,
    },
});

export const configureFrontend = (): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        // Request the settings file
        const res = await axios.get('/settings.json');

        const settings = res.data;
        dispatch(frontendNotification(JSON.stringify(settings)));
    };
};
