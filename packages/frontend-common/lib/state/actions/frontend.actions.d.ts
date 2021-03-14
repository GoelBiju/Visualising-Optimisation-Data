import { Action } from "redux";
import { ActionType, SettingsUrls } from "../state.types";
import { LoadUrlsPayload, NotificationPayload } from "./action.types";
export declare const frontendNotification: (message: string) => ActionType<NotificationPayload>;
export declare const loadUrls: (urls: SettingsUrls) => ActionType<LoadUrlsPayload>;
export declare const loadedSettings: () => Action;
//# sourceMappingURL=frontend.actions.d.ts.map