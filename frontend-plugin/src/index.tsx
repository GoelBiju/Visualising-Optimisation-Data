import * as log from "loglevel";
import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import App from "./App";
import "./index.css";

const pluginName = "frontend-plugin";

const render = (): void => {
  let el = document.getElementById(pluginName);
  // Attempt to re-render the plugin if the corresponding div is present.
  if (el) {
    ReactDOM.render(<App />, document.getElementById(pluginName));
  }
};

// This for local development.
if (process.env.NODE_ENV === "development") {
  render();
  log.setDefaultLevel(log.levels.DEBUG);
} else {
  log.setDefaultLevel(log.levels.ERROR);
}

function domElementGetter(): HTMLElement {
  // Make sure there is a div for us to render into.
  let el = document.getElementById(pluginName);
  if (!el) {
    el = document.createElement("div");
  }

  return el;
}

window.addEventListener("single-spa:routing-event", () => {
  // Attempt to re-render the plugin if the route has changed.
  render();
});

document.addEventListener("frontend", (e) => {
  // Attempt to re-render the plugin if the frontend tell us to.
  const action = (e as CustomEvent).detail;
  if (action.type === "frontend:api:plugin_rerender") {
    render();
  }
});

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  domElementGetter,
});

/* eslint-disable @typescript-eslint/no-explicit-any */
// Single-SPA bootstrap methods have no idea what type of inputs may be
// pushed down from the parent app
export function bootstrap(props: any): Promise<void> {
  return reactLifecycles.bootstrap(props);
}

export function mount(props: any): Promise<void> {
  return reactLifecycles.mount(props);
}

export function unmount(props: any): Promise<void> {
  return reactLifecycles.unmount(props);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();