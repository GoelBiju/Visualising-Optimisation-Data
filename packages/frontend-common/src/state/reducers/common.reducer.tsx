import * as log from "loglevel";
import {
  DataPayload,
  DataRequestType,
  DataType,
  DisconnectSocketSuccessType,
  FetchRunRequestType,
  FetchRunResultType,
  FetchRunsResultType,
  InitiateSocketSuccessType,
  LoadedSettingsType,
  LoadUrlsPayload,
  LoadUrlsType,
  NotificationPayload,
  NotificationType,
  RegisterRoutePayload,
  RegisterRouteType,
  RunPayload,
  RunsPayload,
  SocketPayload,
  SubscribedPayload,
  SubscribedType,
  VisualisationNamePayload,
  VisualisationNameType,
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
    socket: null,
    subscribed: false,
  },
  selectedRun: null,
  selectedVisualisation: "",
  fetchingRun: false,
  runs: [],
  fetchingData: false,
  data: null,
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

export function handleFetchRunRequest(state: FrontendState): FrontendState {
  return {
    ...state,
    fetchingRun: true,
  };
}

export function handleFetchRun(
  state: FrontendState,
  payload: RunPayload
): FrontendState {
  return {
    ...state,
    fetchingRun: false,
    selectedRun: payload.run,
    runs: [],
  };
}

export function handleVisualisationName(
  state: FrontendState,
  payload: VisualisationNamePayload
): FrontendState {
  return {
    ...state,
    selectedVisualisation: payload.visualisationName,
  };
}

export function handleInitiateSocket(
  state: FrontendState,
  payload: SocketPayload
): FrontendState {
  return {
    ...state,
    configuration: {
      ...state.configuration,
      socket: payload.socket,
    },
  };
}

export function handleDisconnectSocket(state: FrontendState): FrontendState {
  return {
    ...state,
    configuration: {
      ...state.configuration,
      socket: null,
    },
  };
}

export function handleSubscribed(
  state: FrontendState,
  payload: SubscribedPayload
): FrontendState {
  return {
    ...state,
    configuration: {
      ...state.configuration,
      subscribed: payload.subscribed,
    },
  };
}

export function handleDataRequest(state: FrontendState): FrontendState {
  return {
    ...state,
    fetchingData: true,
  };
}

export function handleData(
  state: FrontendState,
  payload: DataPayload
): FrontendState {
  return {
    ...state,
    data: payload.data,
    fetchingData: false,
  };
}

const CommonReducer = createReducer(initialState, {
  [NotificationType]: handleNotification,
  [RegisterRouteType]: handleRegisterPlugin,
  [LoadUrlsType]: handleLoadUrls,
  [LoadedSettingsType]: handleLoadedSettings,
  [FetchRunsResultType]: handleFetchRuns,
  [FetchRunRequestType]: handleFetchRunRequest,
  [FetchRunResultType]: handleFetchRun,
  [InitiateSocketSuccessType]: handleInitiateSocket,
  [DisconnectSocketSuccessType]: handleDisconnectSocket,
  [VisualisationNameType]: handleVisualisationName,
  [SubscribedType]: handleSubscribed,
  [DataRequestType]: handleDataRequest,
  [DataType]: handleData,
});

export default CommonReducer;
