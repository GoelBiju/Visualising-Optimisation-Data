import { ActionType, Data, Run, ThunkResult } from "../state.types";
import { DataPayload, RunPayload, RunsPayload, VisualisationNamePayload } from "./action.types";
export declare const fetchRunsResult: (runs: Run[]) => ActionType<RunsPayload>;
export declare const fetchRunResult: (run: Run) => ActionType<RunPayload>;
export declare const setVisualisationName: (visualisationName: string) => ActionType<VisualisationNamePayload>;
export declare const setData: (data: Data) => ActionType<DataPayload>;
export declare const fetchRuns: () => ThunkResult<Promise<void>>;
export declare const fetchRun: (runId: string) => ThunkResult<Promise<void>>;
//# sourceMappingURL=runs.actions.d.ts.map