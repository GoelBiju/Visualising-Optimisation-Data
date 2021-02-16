import * as log from 'loglevel';
import React from 'react';
import MainAppBar from './components/mainAppBar.component';
import Routing from './components/routing.component';
import './stylesheets/App.css';

class App extends React.Component<unknown, { hasError: boolean }> {
    public constructor(props: unknown) {
        super(props);
        this.state = { hasError: false };
    }

    public componentDidCatch(error: Error | null): void {
        this.setState({ hasError: true });
        log.error(`frontend failed with error: ${error}`);
    }

    public render(): React.ReactNode {
        if (this.state.hasError) {
            <div className="error">An error occurred when loading the plugin.</div>;
        } else {
            return (
                <div className="App">
                    {/* <React.Suspense fallback={<div>Finished loading</div>}> */}
                    {/* <Preloader> */}
                    <MainAppBar />
                    <Routing />
                    {/* </Preloader> */}
                    {/* </React.Suspense> */}
                </div>
            );
        }
    }
}

export default App;
