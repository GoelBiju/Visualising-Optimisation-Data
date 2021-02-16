import { Action } from "redux";
import {
  LoadedSettingsType,
  LoadUrlsType,
  NotificationType,
} from "../frontend.types";
import { ActionType, SettingsUrls } from "../state.types";

export interface NotificationPayload {
  message: string;
}

export interface LoadUrlsPayload {
  urls: SettingsUrls;
}

export const frontendNotification = (
  message: string
): ActionType<NotificationPayload> => ({
  type: NotificationType,
  payload: {
    message,
  },
});

export const loadUrls = (urls: SettingsUrls): ActionType<LoadUrlsPayload> => ({
  type: LoadUrlsType,
  payload: {
    urls,
  },
});

export const loadedSettings = (): Action => ({
  type: LoadedSettingsType,
});
