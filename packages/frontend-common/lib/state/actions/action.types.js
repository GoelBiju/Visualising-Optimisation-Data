// Define the microfrontend name
export var microFrontendMessageId = "frontend";
// Plugin communication
export var NotificationType = microFrontendMessageId + ":api:notification";
export var RegisterRouteType = microFrontendMessageId + ":api:register_route";
// Internal
export var LoadUrlsType = microFrontendMessageId + ":load_url";
export var LoadedSettingsType = microFrontendMessageId + ":loaded_settings";
// Run related actions
export var FetchRunsType = microFrontendMessageId + ":fetch_runs";
export var FetchRunsResultType = microFrontendMessageId + ":fetch_runs_result";
export var FetchRunResultType = microFrontendMessageId + ":fetch_run_result";
export var VisualisationNameType = microFrontendMessageId + ":set_visualisation_name";
export var DataRequestType = microFrontendMessageId + ":data_request";
export var DataType = microFrontendMessageId + ":set_data";
// Socket related actions
export var InitiateSocketSuccessType = microFrontendMessageId + ":initiate_socket_success";
export var DisconnectSocketSuccessType = microFrontendMessageId + ":disconnect_socket_success";
export var SubscribedType = microFrontendMessageId + ":set_subscribed";
//# sourceMappingURL=action.types.js.map