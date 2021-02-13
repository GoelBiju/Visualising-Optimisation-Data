import axios from "axios";
import { AnyAction, Store } from "redux";
import loadMicroFrontends from "../../loadMicroFrontends";
import {
  LoadUrlsPayload,
  LoadUrlsType,
  NotificationPayload,
  NotificationType,
  SettingsUrls,
} from "../frontend.types";
import { ActionType, ThunkResult } from "../state.types";

const frontendNotification = (
  message: string
): ActionType<NotificationPayload> => ({
  type: NotificationType,
  payload: {
    message,
  },
});

const loadUrls = (urls: SettingsUrls): ActionType<LoadUrlsPayload> => ({
  type: LoadUrlsType,
  payload: {
    urls,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const configureFrontend = (
  store: () => Store<any, AnyAction>
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    // Request the settings file
    await axios
      .get("/settings.json")
      .then((res) => {
        const settings = res.data;

        if (typeof settings !== "object") {
          throw Error("Configuring frontend: 'settings.json' Invalid format");
        }

        // TODO: Test notification
        dispatch(frontendNotification(JSON.stringify(settings)));

        // Load URLs
        if ("backendUrl" in settings) {
          dispatch(
            loadUrls({
              backendUrl: settings["backendUrl"],
            })
          );
        } else {
          throw new Error("The backendUrl is missing in setttings.json");
        }

        // Load microfrontends
        loadMicroFrontends.init(settings.plugins, store);
      })
      .catch((error) => {
        console.log(`Frontend Error: loading settings.json: ${error.message}`);
      });
  };
};
