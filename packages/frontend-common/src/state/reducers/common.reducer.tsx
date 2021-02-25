import * as log from "loglevel";
import {
  DataPayload,
  DataType,
  DisconnectSocketSuccessType,
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
    // socketConnected: false,
    subscribed: false,
  },
  runs: [],
  selectedRun: null,
  selectedVisualisation: "",
  data: null,
  // currentGeneration: 0,
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
      // socketConnected: true,
    },
  };
}

export function handleDisconnectSocket(state: FrontendState): FrontendState {
  return {
    ...state,
    configuration: {
      ...state.configuration,
      socket: null,
      // socketConnected: false,
    },
  };
}

// export function handleRunGeneration(
//   state: FrontendState,
//   payload: RunGenerationPayload
// ): FrontendState {
//   return {
//     ...state,
//     currentGeneration: payload.generation,
//   };
// }

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

export function handleData(
  state: FrontendState,
  payload: DataPayload
): FrontendState {
  return {
    ...state,
    data: payload.data,
  };
}

const CommonReducer = createReducer(initialState, {
  [NotificationType]: handleNotification,
  [RegisterRouteType]: handleRegisterPlugin,
  [LoadUrlsType]: handleLoadUrls,
  [LoadedSettingsType]: handleLoadedSettings,
  [FetchRunsResultType]: handleFetchRuns,
  [FetchRunResultType]: handleFetchRun,
  [InitiateSocketSuccessType]: handleInitiateSocket,
  [DisconnectSocketSuccessType]: handleDisconnectSocket,
  // [RunGenerationSuccessType]: handleRunGeneration,
  [VisualisationNameType]: handleVisualisationName,
  [SubscribedType]: handleSubscribed,
  [DataType]: handleData,
});

export default CommonReducer;
