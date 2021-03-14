import { __awaiter, __generator } from "tslib";
import ioclient from "socket.io-client";
import { DataRequestType, DisconnectSocketSuccessType, InitiateSocketSuccessType, SubscribedType, } from "./action.types";
export var initiateSocketSuccess = function (socket) { return ({
    type: InitiateSocketSuccessType,
    payload: {
        socket: socket,
    },
}); };
export var disconnectSocketSuccess = function () { return ({
    type: DisconnectSocketSuccessType,
}); };
export var setSubscribed = function (subscribed) { return ({
    type: SubscribedType,
    payload: {
        subscribed: subscribed,
    },
}); };
export var initiateSocket = function (runId) {
    return function (dispatch, getState) { return __awaiter(void 0, void 0, void 0, function () {
        var backendUrl, socketClient;
        return __generator(this, function (_a) {
            backendUrl = getState().frontend.configuration.urls.backendUrl;
            socketClient = ioclient(backendUrl + "/frontend");
            // console.log("io: ", socketClient);
            // Handle connection event
            socketClient.on("connect", function () {
                // Dispatch a new socket connection to the backend
                dispatch(initiateSocketSuccess(socketClient));
            });
            return [2 /*return*/];
        });
    }); };
};
// TODO: Disconnect socket
export var disconnectSocket = function () {
    return function (dispatch, getState) { return __awaiter(void 0, void 0, void 0, function () {
        var socket;
        return __generator(this, function (_a) {
            socket = getState().frontend.configuration.socket;
            if (socket && socket.connected) {
                socket.disconnect();
                console.log("Disconnected socket");
                dispatch(disconnectSocketSuccess());
            }
            return [2 /*return*/];
        });
    }); };
};
export var subscribeToGenerations = function (runId
// callback: (generation: number) => void
) {
    return function (dispatch, getState) { return __awaiter(void 0, void 0, void 0, function () {
        var socket;
        return __generator(this, function (_a) {
            socket = getState().frontend.configuration.socket;
            // Join the optimisation run room
            if (socket && socket.connected) {
                // Emit a subscribe message to the backend with the run ID
                socket.emit("subscribe", runId);
                console.log("Emitted subscribe for: ", runId);
                dispatch(setSubscribed(true));
            }
            return [2 /*return*/];
        });
    }); };
};
export var unsubscribeFromGenerations = function (runId) {
    return function (dispatch, getState) { return __awaiter(void 0, void 0, void 0, function () {
        var socket;
        return __generator(this, function (_a) {
            socket = getState().frontend.configuration.socket;
            if (socket && socket.connected) {
                socket.emit("unsubscribe", runId);
                console.log("Emitted unsubscribe for: ", runId);
                dispatch(setSubscribed(false));
            }
            return [2 /*return*/];
        });
    }); };
};
export var dataRequest = function () { return ({
    type: DataRequestType,
}); };
// Retrieve the data from a run given the ID and generation number
export var fetchData = function (dataId, generation) {
    return function (dispatch, getState) { return __awaiter(void 0, void 0, void 0, function () {
        var socket;
        return __generator(this, function (_a) {
            socket = getState().frontend.configuration.socket;
            if (socket && socket.connected) {
                // Dispatch the fetch data request
                dispatch(dataRequest());
                // Emit the socket event
                socket.emit("data", {
                    dataId: dataId,
                    generation: generation,
                });
            }
            return [2 /*return*/];
        });
    }); };
};
//# sourceMappingURL=socket.actions.js.map