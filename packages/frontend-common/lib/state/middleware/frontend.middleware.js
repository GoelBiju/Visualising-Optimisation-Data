import { microFrontendMessageId, RegisterRouteType, } from "../actions/action.types";
// Broadcast a message to plugins
var broadcastToPlugins = function (action) {
    document.dispatchEvent(new CustomEvent(microFrontendMessageId, { detail: action }));
};
// Listen to messages from plugins
export var listenToPlugins = function (dispatch) {
    document.addEventListener(microFrontendMessageId, function (event) {
        console.log("Got: ", event);
        var pluginMessage = event;
        console.log(pluginMessage);
        if (pluginMessage.detail &&
            pluginMessage.detail.type &&
            pluginMessage.detail.type.startsWith(microFrontendMessageId + ":api:")) {
            // Send message to Redux in parent app
            switch (pluginMessage.detail.type) {
                // case RequestPluginRerenderType:
                // This is a message sent from parent app
                // break;
                case RegisterRouteType:
                    console.log("Dispatching");
                    dispatch(pluginMessage.detail);
                    break;
                default:
                    console.warn("Unexpected message received from plugin, not dispatched:\nevent.detail = " + JSON.stringify(pluginMessage.detail));
            }
        }
        else {
            console.error("Invalid message received from a plugin:\nevent.detail = " + JSON.stringify(pluginMessage.detail));
        }
    });
};
// No need to store otherwise store => next => action
// May need store if we need a plugin rerender
var FrontendMiddleware = (function () { return function (next) { return function (action) {
    if (action.payload && action.payload.broadcast) {
        broadcastToPlugins(action);
    }
    return next(action);
}; }; });
export default FrontendMiddleware;
//# sourceMappingURL=frontend.middleware.js.map