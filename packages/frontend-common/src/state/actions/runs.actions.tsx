import axios from "axios";
import { FetchRunsResultType, Run, RunsPayload } from "../frontend.types";
import { ActionType, ThunkResult } from "../state.types";

export const fetchRunsResult = (runs: Run[]): ActionType<RunsPayload> => ({
  type: FetchRunsResultType,
  payload: {
    runs,
  },
});

// Retrieve all the runs from the API
export const fetchRuns = (): ThunkResult<Promise<void>> => {
  return async (dispatch, getState) => {
    // const { backendUrl } = getState().frontend.configuration.urls;
    console.log("Config: ", getState().frontend.configuration);
    await axios
      .get(`http://localhost:9000/api/runs`)
      .then((response) => {
        dispatch(fetchRunsResult(response.data));
      })
      .catch((error) => {
        console.error(`fetchRuns: ${error.message}`);
      });
  };
};
