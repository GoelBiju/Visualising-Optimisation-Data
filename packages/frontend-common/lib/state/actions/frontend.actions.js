import { LoadedSettingsType, LoadUrlsType, NotificationType, } from "./action.types";
export var frontendNotification = function (message) { return ({
    type: NotificationType,
    payload: {
        message: message,
    },
}); };
export var loadUrls = function (urls) { return ({
    type: LoadUrlsType,
    payload: {
        urls: urls,
    },
}); };
export var loadedSettings = function () { return ({
    type: LoadedSettingsType,
}); };
//# sourceMappingURL=frontend.actions.js.map