import { AnyAction, Dispatch, Middleware } from "redux";
import {
  microFrontendMessageId,
  RegisterRouteType,
} from "../actions/action.types";

type microFrontendMessageType = CustomEvent<AnyAction>;

// Broadcast a message to plugins
const broadcastToPlugins = (action: AnyAction): void => {
  document.dispatchEvent(
    new CustomEvent(microFrontendMessageId, { detail: action })
  );
};

// Listen to messages from plugins
export const listenToPlugins = (dispatch: Dispatch): void => {
  document.addEventListener(microFrontendMessageId, (event) => {
    console.log("Got: ", event);
    const pluginMessage = event as microFrontendMessageType;
    console.log(pluginMessage);

    if (
      pluginMessage.detail &&
      pluginMessage.detail.type &&
      pluginMessage.detail.type.startsWith(`${microFrontendMessageId}:api:`)
    ) {
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
          console.warn(
            `Unexpected message received from plugin, not dispatched:\nevent.detail = ${JSON.stringify(
              pluginMessage.detail
            )}`
          );
      }
    } else {
      console.error(
        `Invalid message received from a plugin:\nevent.detail = ${JSON.stringify(
          pluginMessage.detail
        )}`
      );
    }
  });
};

// No need to store otherwise store => next => action
// May need store if we need a plugin rerender
const FrontendMiddleware: Middleware = (() => (next: Dispatch<AnyAction>) => (
  action: AnyAction
): AnyAction => {
  if (action.payload && action.payload.broadcast) {
    broadcastToPlugins(action);
  }

  return next(action);
}) as Middleware;

export default FrontendMiddleware;
