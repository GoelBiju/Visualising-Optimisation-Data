import * as log from "loglevel";
import React from "react";
import "./App.css";

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

class App extends React.Component<unknown, { hasError: boolean }> {
  public constructor(props: unknown) {
    super(props);
    this.state = { hasError: false };
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
    return <div className="App">This is the plugin.</div>;
    // }
  }
}

export default App;
