import { ConnectedRouter, routerMiddleware } from "connected-react-router";
// import AppReducer from "./state/reducers/App.reducer";
import { microFrontendMessageId } from "frontend-common";
import { createBrowserHistory } from "history";
import * as log from "loglevel";
import React from "react";
import { Provider } from "react-redux";
import { AnyAction, Store } from "redux";
// import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import "./App.css";
import ExampleComponent from "./example.component";

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

// /* eslint-disable no-underscore-dangle, @typescript-eslint/no-explicit-any */
// const composeEnhancers =
//   (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// /* eslint-enable */

// Create the store
// const store = createStore(
//   AppReducer(history),
//   composeEnhancers(applyMiddleware(...middleware))
// );

const registerRouteAction = {
  type: "frontend:api:register_route",
  payload: {
    section: "Test",
    link: "/runs/:runId/visualisations/:visualisationName/data",
    plugin: "frontend-plugin",
    displayName: "Frontend Plugin",
  },
};

// Dispatch the register route event.
document.dispatchEvent(
  new CustomEvent(microFrontendMessageId, {
    detail: registerRouteAction,
  })
);

/* eslint-disable @typescript-eslint/no-explicit-any */
class App extends React.Component<
  any,
  { hasError: boolean; store: Store<any, AnyAction> }
> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public constructor(props: any) {
    super(props);
    this.state = { hasError: false, store: props.store };
    console.log("Props: ", props);
  }

  public componentDidCatch(error: Error | null): void {
    this.setState({ ...this.state, hasError: true });
    log.error(`frontend-plugin failed with error: ${error}`);
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error">An error occurred when loading the plugin.</div>
      );
    } else if (!this.state.store) {
      return <div className="error">No store received.</div>;
    } else {
      return (
        <Provider store={this.state.store}>
          <ConnectedRouter history={history}>
            <ExampleComponent />
          </ConnectedRouter>
        </Provider>
      );
    }
  }
}

export default App;
