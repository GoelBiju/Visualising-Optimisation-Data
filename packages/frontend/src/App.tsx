import { StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import MainAppBar from './components/mainAppBar.component';
import Preloader from './components/preloader.component';
import Routing from './components/routing.component';
import './stylesheets/App.css';

interface AppProps {
    location: string;
}

class App extends React.Component<AppProps, unknown> {
    public constructor(props: AppProps) {
        super(props);
    }

    public componentDidUpdate(prevProps: AppProps) {
        if (this.props.location !== prevProps.location) {
            this.render();
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="App">
                <React.Suspense fallback={<div>Finished Loading</div>}>
                    <Preloader>
                        <MainAppBar />
                        <Routing />
                    </Preloader>
                </React.Suspense>
            </div>
        );
    }
}

const mapStateToProps = (state: StateType): AppProps => {
    return {
        location: state.router.location.pathname,
    };
};

export default connect(mapStateToProps)(App);
