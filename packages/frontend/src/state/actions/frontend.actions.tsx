import axios from 'axios';
import { AnyAction, Store } from 'redux';
import { NotificationPayload, NotificationType } from '../frontend.types';
import { ActionType, ThunkResult } from '../state.types';
import loadMicroFrontends from './loadMicroFrontends';

export const frontendNotification = (message: string): ActionType<NotificationPayload> => ({
    type: NotificationType,
    payload: {
        message,
    },
});

export const configureFrontend = (store: Store<unknown, AnyAction>): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        // Request the settings file
        await axios
            .get('/settings.json')
            .then((res) => {
                const settings = res.data;
                dispatch(frontendNotification(JSON.stringify(settings)));

                // Load microfrontends
                loadMicroFrontends.init(settings.plugins, store);
            })
            .catch((error) => {
                console.log(`Frontend Error: loading settings.json: ${error.message}`);
            });
    };
};
