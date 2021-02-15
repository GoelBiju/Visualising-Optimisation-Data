import { RouterState } from "connected-react-router";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RegisterRoutePayload, Run } from "./frontend.types";

export interface SettingsUrls {
  backendUrl: string;
}

export interface Plugin {
  name: string;
  src: string;
  enable: boolean;
}

export interface FrontendState {
  notifications: string[];
  configuration: {
    plugins: RegisterRoutePayload[];
    urls: SettingsUrls;
    settingsLoaded: boolean;
  };
  runs: Run[];
  selectedRun: Run;
  selectedVisualisation: string;
  // data: Data[];
}

export interface StateType {
  frontend: FrontendState;
  router: RouterState;
}

export interface ActionType<T> {
  type: string;
  payload: T;
}

export type ThunkResult<R> = ThunkAction<R, StateType, null, AnyAction>;
