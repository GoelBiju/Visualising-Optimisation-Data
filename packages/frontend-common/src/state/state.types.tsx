import { RouterState } from "connected-react-router";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RegisterRoutePayload } from "./actions/action.types";

export interface SettingsUrls {
  backendUrl: string;
}

export interface Run {
  _id: string;
  dataId: string;
  title: string;
  problem: string;
  algorithm: string;
  algorithmParameters: {
    [key: string]: string;
  };
  populationSize: number;
  currentGeneration: number;
  totalGenerations: number;
  graphs: string[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FrontendState {
  notifications: string[];
  configuration: {
    plugins: RegisterRoutePayload[];
    urls: SettingsUrls;
    settingsLoaded: boolean;
    socket: SocketIOClient.Socket | null;
    // TODO: Add subscribed to state?
    // TODO: Remove socketConnected
    // socketConnected: boolean;
    subscribed: boolean;
  };
  runs: Run[];
  selectedRun: Run | null;
  selectedVisualisation: string;
  data: {
    generation: number;
    data: number[][];
    time: Date;
  }[];
  // currentGeneration: number;
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
