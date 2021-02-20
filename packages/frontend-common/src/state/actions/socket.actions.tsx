import { ActionType, ThunkResult } from "../state.types";
import { InitiateSocketSuccessType, SocketPayload } from "./action.types";

export const initiateSocketSuccess = (
  socket: SocketIOClient.Socket
): ActionType<SocketPayload> => ({
  type: InitiateSocketSuccessType,
  payload: {
    socket,
  },
});

export const initiateSocket = (): ThunkResult<Promise<void>> => {
  return async (dispatch, getState) => {
    const { backendUrl } = getState().frontend.configuration.urls;

    // Set up the socket
    const socket = io(`${backendUrl}/frontend`);

    if (socket.connected) {
      // Dispatch a new socket connection to the backend
      dispatch(initiateSocketSuccess(socket));
    } else {
      console.error(
        `Unable to initialise a socket connection with backend at ${backendUrl}/frontend`
      );
    }
  };
};
