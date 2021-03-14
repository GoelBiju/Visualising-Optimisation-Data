import { __awaiter, __generator } from "tslib";
import axios from "axios";
import { DataType, FetchRunResultType, FetchRunsResultType, VisualisationNameType, } from "./action.types";
export var fetchRunsResult = function (runs) { return ({
    type: FetchRunsResultType,
    payload: {
        runs: runs,
    },
}); };
export var fetchRunResult = function (run) { return ({
    type: FetchRunResultType,
    payload: {
        run: run,
    },
}); };
export var setVisualisationName = function (visualisationName) { return ({
    type: VisualisationNameType,
    payload: {
        visualisationName: visualisationName,
    },
}); };
export var setData = function (data) { return ({
    type: DataType,
    payload: {
        data: data,
    },
}); };
// Retrieve all the runs from the API
export var fetchRuns = function () {
    return function (dispatch, getState) { return __awaiter(void 0, void 0, void 0, function () {
        var backendUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    backendUrl = getState().frontend.configuration.urls.backendUrl;
                    console.log("Config: ", getState().frontend.configuration);
                    return [4 /*yield*/, axios
                            .get(backendUrl + "/api/runs")
                            .then(function (response) {
                            dispatch(fetchRunsResult(response.data.runs));
                        })
                            .catch(function (error) {
                            console.error("fetchRuns: " + error.message);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
};
// Retrieve a specific run from the API
export var fetchRun = function (runId) {
    return function (dispatch, getState) { return __awaiter(void 0, void 0, void 0, function () {
        var backendUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    backendUrl = getState().frontend.configuration.urls.backendUrl;
                    console.log("Config: ", getState().frontend.configuration);
                    return [4 /*yield*/, axios
                            .get(backendUrl + "/api/runs/" + runId)
                            .then(function (response) {
                            console.log("Got run: ", response.data);
                            dispatch(fetchRunResult(response.data.run));
                        })
                            .catch(function (error) {
                            console.error("fetchRun: " + error.message);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
};
//# sourceMappingURL=runs.actions.js.map