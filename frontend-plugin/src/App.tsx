import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as log from "loglevel";
import React from "react";
import { Provider } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router";
import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import "./App.css";
import AppReducer from "./state/reducers/App.reducer";

const history = createBrowserHistory();
const middleware = [thunk, routerMiddleware(history)];
if (process.env.NODE_ENV === "development") {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const logger = (createLogger as any)();
  middleware.push(logger);
  log.setDefaultLevel(log.levels.DEBUG);
} else {
  log.setDefaultLevel(log.levels.ERROR);
}

/* eslint-disable no-underscore-dangle, @typescript-eslint/no-explicit-any */
const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

// Create the store
const store = createStore(
  AppReducer(history),
  composeEnhancers(applyMiddleware(...middleware))
);

const registerRouteAction = {
  type: "frontend:api:register_route",
  payload: {
    section: "Test",
    link: "/",
    plugin: "frontend-plugin",
    displayName: "Frontend Plugin",
  },
};

// Dispatch the register route event.
document.dispatchEvent(
  new CustomEvent("frontend", {
    detail: registerRouteAction,
  })
);

/* eslint-disable @typescript-eslint/no-explicit-any */
class App extends React.Component<any, { hasError: boolean }> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public constructor(props: any) {
    super(props);
    this.state = { hasError: false };
    console.log("Props: ", props);
  }

  public componentDidCatch(error: Error | null): void {
    this.setState({ hasError: true });
    log.error(`frontend-plugin failed with error: ${error}`);
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error">An error occurred when loading the plugin.</div>
      );
    } else {
      return (
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Switch>
              <Route
                exact
                path={"/runs/:runId/visualisations/:visualisationName"}
                render={({
                  match,
                }: RouteComponentProps<{
                  runId: string;
                  visualisationName: string;
                }>) => (
                  <div className="App">
                    The run ID is {match.params.runId} and visualisation name is{" "}
                    {match.params.visualisationName}.
                  </div>
                )}
              />
            </Switch>
          </ConnectedRouter>
        </Provider>
      );
    }
  }
}

export default App;
