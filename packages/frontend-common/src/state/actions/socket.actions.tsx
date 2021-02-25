import { Action } from "redux";
import ioclient from "socket.io-client";
import { ActionType, ThunkResult } from "../state.types";
import {
  DisconnectSocketSuccessType,
  InitiateSocketSuccessType,

  // RunGenerationSuccessType,
  SocketPayload,
  SubscribedPayload,
  SubscribedType,
} from "./action.types";

export const initiateSocketSuccess = (
  socket: SocketIOClient.Socket
): ActionType<SocketPayload> => ({
  type: InitiateSocketSuccessType,
  payload: {
    socket,
  },
});

export const disconnectSocketSuccess = (): Action => ({
  type: DisconnectSocketSuccessType,
});

// export const runGenerationSuccess = (
//   generation: number
// ): ActionType<RunGenerationPayload> => ({
//   type: RunGenerationSuccessType,
//   payload: {
//     generation,
//   },
// });

export const setSubscribed = (
  subscribed: boolean
): ActionType<SubscribedPayload> => ({
  type: SubscribedType,
  payload: {
    subscribed,
  },
});

export const initiateSocket = (runId: string): ThunkResult<Promise<void>> => {
  return async (dispatch, getState) => {
    const { backendUrl } = getState().frontend.configuration.urls;

    // Set up the socket
    const socketClient = ioclient(`${backendUrl}/frontend`);
    // console.log("io: ", socketClient);

    // Handle connection event
    socketClient.on("connect", () => {
      // Dispatch a new socket connection to the backend
      dispatch(initiateSocketSuccess(socketClient));
    });
  };
};

// TODO: Disconnect socket
export const disconnectSocket = (): ThunkResult<Promise<void>> => {
  return async (dispatch, getState) => {
    // Get the socket connection
    const { socket } = getState().frontend.configuration;

    if (socket && socket.connected) {
      socket.disconnect();
      console.log("Disconnected socket");

      dispatch(disconnectSocketSuccess());
    }
  };
};

export const subscribeToGenerations = (
  runId: string
  // callback: (generation: number) => void
): ThunkResult<Promise<void>> => {
  return async (dispatch, getState) => {
    // Get the socket connection
    const { socket } = getState().frontend.configuration;

    // Join the optimisation run room
    if (socket && socket.connected) {
      // Emit a subscribe message to the backend with the run ID
      socket.emit("subscribe", runId);
      console.log("Emitted subscribe for: ", runId);
    }
  };
};

// Retrieve the data from a run given the ID and generation number
export const fetchData = (
  dataId: string,
  generation: number
): ThunkResult<Promise<void>> => {
  return async (dispatch, getState) => {
    const { socket } = getState().frontend.configuration;

    // socketConnected
    if (socket && socket.connected) {
      // Emit the socket event
      socket.emit("data", {
        dataId,
        generation,
      });
    }
  };
};
