import { AnyAction, Dispatch, Middleware } from 'redux';
import { microFrontendMessageId, RegisterRouteType } from '../frontend.types';

// const microFrontendMessageId = 'frontend';

const broadcastToPlugins = (action: AnyAction): void => {
    document.dispatchEvent(new CustomEvent(microFrontendMessageId, { detail: action }));
};

type microFrontendMessageType = CustomEvent<AnyAction>;

export const listenToPlugins = (dispatch: Dispatch): void => {
    document.addEventListener(microFrontendMessageId, (event) => {
        const pluginMessage = event as microFrontendMessageType;

        if (
            pluginMessage.detail &&
            pluginMessage.detail.type &&
            pluginMessage.detail.type.startsWith(`${microFrontendMessageId}:api:`)
        ) {
            // Send message to Redux in parent app
            switch (pluginMessage.detail.type) {
                case RegisterRouteType:
                    dispatch(pluginMessage.detail);
                    break;
                default:
                    console.warn(
                        `Unexpected message received from plugin, not dispatched:\nevent.detail = ${JSON.stringify(
                            pluginMessage.detail,
                        )}`,
                    );
            }
        } else {
            console.error(
                `Invalid message received from a plugin:\nevent.detail = ${JSON.stringify(pluginMessage.detail)}`,
            );
        }
    });
};

// No need to store otherwise store => next => action
// May need store if we need a plugin rerender
const FrontendMiddleware: Middleware = (() => (next: Dispatch<AnyAction>) => (action: AnyAction): AnyAction => {
    if (action.payload && action.payload.broadcast) {
        broadcastToPlugins(action);
    }

    return next(action);
}) as Middleware;

export default FrontendMiddleware;
