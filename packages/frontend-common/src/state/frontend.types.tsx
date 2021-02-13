import { SettingsUrls } from "./state.types";

export const microFrontendMessageId = "frontend";

// Plugin communication
export const NotificationType = `${microFrontendMessageId}:api:notification`;
export const RegisterRouteType = `${microFrontendMessageId}:api:register_route`;
// export const RequestPluginRerenderType = `${microFrontendMessageId}:api:plugin_rerender`;

// Internal
export const LoadUrlsType = `${microFrontendMessageId}:load_url`;
export const LoadedSettingsType = `${microFrontendMessageId}:loaded_settings`;
export const FetchRunsType = `${microFrontendMessageId}:fetch_runs`;
export const FetchRunsResultType = `${microFrontendMessageId}:fetch_runs_result`;

export interface NotificationPayload {
  message: string;
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

export interface Run {
  id: string;
  dataId: string;
  title: string;
  problem: string;
  algorithm: string;
  algorithmParameters: {
    [key: string]: string;
  };
  populationSize: number;
  totalPopulationSize: number;
  generations: number;
  graphs: string[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RunsPayload {
  runs: Run[];
}
