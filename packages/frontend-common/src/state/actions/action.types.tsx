import { Data, Run, SettingsUrls } from "../state.types";

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
export const VisualisationNameType = `${microFrontendMessageId}:set_visualisation_name`;
export const DataRequestType = `${microFrontendMessageId}:data_request`;
export const DataType = `${microFrontendMessageId}:set_data`;

// Socket related actions
export const InitiateSocketSuccessType = `${microFrontendMessageId}:initiate_socket_success`;
export const DisconnectSocketSuccessType = `${microFrontendMessageId}:disconnect_socket_success`;
export const SubscribedType = `${microFrontendMessageId}:set_subscribed`;

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

export interface VisualisationNamePayload {
  visualisationName: string;
}

export interface SocketPayload {
  socket: SocketIOClient.Socket;
}

// export interface RunGenerationPayload {
//   generation: number;
// }

export interface SubscribedPayload {
  subscribed: boolean;
}

export interface DataPayload {
  data: Data;
}
