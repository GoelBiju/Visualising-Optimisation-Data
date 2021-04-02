import { RouterState } from "connected-react-router";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RegisterRoutePayload } from "./actions/action.types";

export interface SettingsUrls {
  backendUrl: string;
}

export interface Run {
  _id: string;
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
  previousData: boolean;
  dataId: string;
  createdAt: string;
  updatedAt: string;
}

// Allow for multi-dimensional number arrays;
// could be normally a 2D array or list with 1D, 2D etc.
type GenerationData = GenerationDataArray;
interface GenerationDataArray extends Array<GenerationData | number> {}

export type Data = {
  generation: number;
  data: GenerationData;
  time: Date;
  completed: boolean;
} | null;

export interface FrontendState {
  notifications: string[];
  configuration: {
    plugins: RegisterRoutePayload[];
    urls: SettingsUrls;
    settingsLoaded: boolean;
    socket: SocketIOClient.Socket | null;
    subscribed: boolean;
  };
  selectedRun: Run | null;
  selectedVisualisation: string;
  fetchingRun: boolean;
  runs: Run[];
  fetchingData: boolean;
  data: Data;
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
