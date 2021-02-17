import * as log from "loglevel";
import {
  FetchRunResultType,
  FetchRunsResultType,
  LoadedSettingsType,
  LoadUrlsPayload,
  LoadUrlsType,
  NotificationPayload,
  NotificationType,
  RegisterRoutePayload,
  RegisterRouteType,
  RunPayload,
  RunsPayload,
} from "../actions/action.types";
import { FrontendState } from "../state.types";
import createReducer from "./createReducer";

export const initialState: FrontendState = {
  notifications: [],
  configuration: {
    plugins: [],
    urls: {
      backendUrl: "",
    },
    settingsLoaded: false,
  },
  runs: [],
  selectedRun: null,
  selectedVisualisation: "",
};

const updatePlugins = (
  existingPlugins: RegisterRoutePayload[],
  payload: RegisterRoutePayload
): RegisterRoutePayload[] => {
  if (!existingPlugins.some((p) => p.link === payload.link)) {
    return [...existingPlugins, payload];
  }

  log.error(
    `Duplicate plugin route identified: ${payload.link}. ${payload.plugin}: '${payload.displayName} not registered`
  );
  return existingPlugins;
};

export function handleNotification(
  state: FrontendState,
  payload: NotificationPayload
): FrontendState {
  return {
    ...state,
    notifications: [payload.message],
  };
}

export function handleRegisterPlugin(
  state: FrontendState,
  payload: RegisterRoutePayload
): FrontendState {
  return {
    ...state,
    configuration: {
      ...state.configuration,
      plugins: updatePlugins(state.configuration.plugins, payload),
    },
  };
}

export function handleLoadUrls(
  state: FrontendState,
  payload: LoadUrlsPayload
): FrontendState {
  return {
    ...state,
    configuration: {
      ...state.configuration,
      urls: payload.urls,
    },
  };
}

export function handleLoadedSettings(state: FrontendState): FrontendState {
  return {
    ...state,
    configuration: {
      ...state.configuration,
      settingsLoaded: true,
    },
  };
}

export function handleFetchRuns(
  state: FrontendState,
  payload: RunsPayload
): FrontendState {
  return {
    ...state,
    runs: payload.runs,
  };
}

export function handleFetchRun(
  state: FrontendState,
  payload: RunPayload
): FrontendState {
  return {
    ...state,
    selectedRun: payload.run,
    runs: [],
  };
}

const CommonReducer = createReducer(initialState, {
  [NotificationType]: handleNotification,
  [RegisterRouteType]: handleRegisterPlugin,
  [LoadUrlsType]: handleLoadUrls,
  [LoadedSettingsType]: handleLoadedSettings,
  [FetchRunsResultType]: handleFetchRuns,
  [FetchRunResultType]: handleFetchRun,
});

export default CommonReducer;
