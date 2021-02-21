import { Run, SettingsUrls, SocketClient } from "../state.types";

// Define the microfrontend name
export const microFrontendMessageId = "frontend";

// Plugin communication
export const NotificationType = `${microFrontendMessageId}:api:notification`;
export const RegisterRouteType = `${microFrontendMessageId}:api:register_route`;

// Internal
export const LoadUrlsType = `${microFrontendMessageId}:load_url`;
export const LoadedSettingsType = `${microFrontendMessageId}:loaded_settings`;

// Run related actions
export const FetchRunsType = `${microFrontendMessageId}:fetch_runs`;
export const FetchRunsResultType = `${microFrontendMessageId}:fetch_runs_result`;
export const FetchRunResultType = `${microFrontendMessageId}:fetch_run_result`;

// Socket related actions
export const InitiateSocketSuccessType = `${microFrontendMessageId}:initiate_socket_success`;

export interface RegisterRoutePayload {
  section: string;
  link: string;
  plugin: string;
  displayName: string;
}

export interface NotificationPayload {
  message: string;
}

export interface LoadUrlsPayload {
  urls: SettingsUrls;
}

export interface RunsPayload {
  runs: Run[];
}

export interface RunPayload {
  run: Run;
}

export interface SocketPayload {
  socket: SocketClient;
}
