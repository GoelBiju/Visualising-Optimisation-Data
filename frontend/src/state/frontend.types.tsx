export const microFrontendMessageId = 'frontend';

export const NotificationType = `${microFrontendMessageId}:api:notification`;
export const RegisterRouteType = `${microFrontendMessageId}:api:register_route`;
export const RequestPluginRerenderType = `${microFrontendMessageId}:api:plugin_rerender`;

export interface NotificationPayload {
    message: string;
}

export interface RegisterRoutePayload {
    section: string;
    link: string;
    plugin: string;
    displayName: string;
}
