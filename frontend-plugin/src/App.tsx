import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as log from "loglevel";
import React from "react";
import "./App.css";

const history = createBrowserHistory();
const middleware = [routerMiddleware(history)];
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const registerRouteAction = {
  type: "frontend:api:register_route",
  payload: {
    section: "Test",
    link: "/test",
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
    // if (this.state.hasError) {
    //   return (
    //     <div className="error">An error occurred when loading the plugin.</div>
    //   );
    // } else {
    return <div className="App">This is the plugin</div>;
    // }
  }
}

export default App;
