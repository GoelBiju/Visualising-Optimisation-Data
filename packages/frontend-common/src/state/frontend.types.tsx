export const microFrontendMessageId = "frontend";

// Plugin communication
export const NotificationType = `${microFrontendMessageId}:api:notification`;
export const RegisterRouteType = `${microFrontendMessageId}:api:register_route`;
// export const RequestPluginRerenderType = `${microFrontendMessageId}:api:plugin_rerender`;

// Internal
export const LoadUrlsType = `${microFrontendMessageId}:load_url`;

export interface NotificationPayload {
  message: string;
}

export interface SettingsUrls {
  backendUrl: string;
}

export interface LoadUrlsPayload {
  urls: SettingsUrls;
}

export interface RegisterRoutePayload {
  section: string;
  link: string;
  plugin: string;
  displayName: string;
}
