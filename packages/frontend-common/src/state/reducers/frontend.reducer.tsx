import * as log from "loglevel";
import {
  LoadUrlsPayload,
  LoadUrlsType,
  NotificationPayload,
  NotificationType,
  RegisterRoutePayload,
  RegisterRouteType,
} from "../frontend.types";
import { FrontendState } from "../state.types";
import createReducer from "./createReducer";

export const initialState: FrontendState = {
  configuration: {
    plugins: [],
    urls: {
      backendUrl: "",
    },
  },
  notifications: [],
  runId: -1,
  visualisationName: "",
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

const FrontendReducer = createReducer(initialState, {
  [NotificationType]: handleNotification,
  [RegisterRouteType]: handleRegisterPlugin,
  [LoadUrlsType]: handleLoadUrls,
});

export default FrontendReducer;
