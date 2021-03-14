/// <reference types="socket.io-client" />
import { Data, Run, SettingsUrls } from "../state.types";
export declare const microFrontendMessageId = "frontend";
export declare const NotificationType: string;
export declare const RegisterRouteType: string;
export declare const LoadUrlsType: string;
export declare const LoadedSettingsType: string;
export declare const FetchRunsType: string;
export declare const FetchRunsResultType: string;
export declare const FetchRunResultType: string;
export declare const VisualisationNameType: string;
export declare const DataRequestType: string;
export declare const DataType: string;
export declare const InitiateSocketSuccessType: string;
export declare const DisconnectSocketSuccessType: string;
export declare const SubscribedType: string;
export interface RegisterRoutePayload {
    section: string;
    link: string;
    plugin: string;
    displayName: string;
}
export interface NotificationPayload {
    message: string;
}
export interface LoadUrlsPayload {
    urls: SettingsUrls;
}
export interface RunsPayload {
    runs: Run[];
}
export interface RunPayload {
    run: Run;
}
export interface VisualisationNamePayload {
    visualisationName: string;
}
export interface SocketPayload {
    socket: SocketIOClient.Socket;
}
export interface SubscribedPayload {
    subscribed: boolean;
}
export interface DataPayload {
    data: Data;
}
//# sourceMappingURL=action.types.d.ts.map