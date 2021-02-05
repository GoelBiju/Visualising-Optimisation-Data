import { NotificationPayload, NotificationType } from '../frontend.types';
import { ActionType } from '../state.types';

export const frontendNotification = (message: string): ActionType<NotificationPayload> => ({
    type: NotificationType,
    payload: {
        message,
    },
});
