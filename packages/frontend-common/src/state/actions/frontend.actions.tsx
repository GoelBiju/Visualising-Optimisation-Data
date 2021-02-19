import { Action } from "redux";
import { ActionType, SettingsUrls } from "../state.types";
import {
  LoadedSettingsType,
  LoadUrlsPayload,
  LoadUrlsType,
  NotificationPayload,
  NotificationType,
} from "./action.types";

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
