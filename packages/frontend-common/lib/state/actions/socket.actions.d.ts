/// <reference types="socket.io-client" />
import { Action } from "redux";
import { ActionType, ThunkResult } from "../state.types";
import { SocketPayload, SubscribedPayload } from "./action.types";
export declare const initiateSocketSuccess: (socket: SocketIOClient.Socket) => ActionType<SocketPayload>;
export declare const disconnectSocketSuccess: () => Action;
export declare const setSubscribed: (subscribed: boolean) => ActionType<SubscribedPayload>;
export declare const initiateSocket: (runId: string) => ThunkResult<Promise<void>>;
export declare const disconnectSocket: () => ThunkResult<Promise<void>>;
export declare const subscribeToGenerations: (runId: string) => ThunkResult<Promise<void>>;
export declare const unsubscribeFromGenerations: (runId: string) => ThunkResult<Promise<void>>;
export declare const dataRequest: () => Action;
export declare const fetchData: (dataId: string, generation: number) => ThunkResult<Promise<void>>;
//# sourceMappingURL=socket.actions.d.ts.map