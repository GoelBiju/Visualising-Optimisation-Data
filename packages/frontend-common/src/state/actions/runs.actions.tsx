import axios from "axios";
import { Action } from "redux";
import { ActionType, Data, Run, ThunkResult } from "../state.types";
import {
  DataPayload,
  DataType,
  FetchRunRequestType,
  FetchRunResultType,
  FetchRunsResultType,
  RunPayload,
  RunsPayload,
  VisualisationNamePayload,
  VisualisationNameType,
} from "./action.types";

export const fetchRunsResult = (runs: Run[]): ActionType<RunsPayload> => ({
  type: FetchRunsResultType,
  payload: {
    runs,
  },
});

export const fetchRunRequest = (): Action => ({
  type: FetchRunRequestType,
});

export const fetchRunResult = (run: Run): ActionType<RunPayload> => ({
  type: FetchRunResultType,
  payload: {
    run,
  },
});

export const setVisualisationName = (
  visualisationName: string
): ActionType<VisualisationNamePayload> => ({
  type: VisualisationNameType,
  payload: {
    visualisationName,
  },
});

export const setData = (data: Data): ActionType<DataPayload> => ({
  type: DataType,
  payload: {
    data,
  },
});



// Retrieve all the runs from the API
export const fetchRuns = (): ThunkResult<Promise<void>> => {
  return async (dispatch, getState) => {
    const { backendUrl } = getState().frontend.configuration.urls;
    // console.log("Config: ", getState().frontend.configuration);
    await axios
      .get(`${backendUrl}/api/runs`)
      .then((response) => {
        dispatch(fetchRunsResult(response.data.runs));
      })
      .catch((error) => {
        console.error(`fetchRuns: ${error.message}`);
      });
  };
};

// Retrieve a specific run from the API
export const fetchRun = (runId: string): ThunkResult<Promise<void>> => {
  return async (dispatch, getState) => {
    dispatch(fetchRunRequest());

    const { backendUrl } = getState().frontend.configuration.urls;
    // console.log("Config: ", getState().frontend.configuration);
    await axios
      .get(`${backendUrl}/api/runs/${runId}`)
      .then((response) => {
        // console.log("Got run: ", response.data);
        dispatch(fetchRunResult(response.data.run));
      })
      .catch((error) => {
        console.error(`fetchRun: ${error.message}`);
      });
  };
};
