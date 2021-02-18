import { createStyles, makeStyles } from '@material-ui/core/styles';
import { frontendNotification, RegisterRoutePayload, StateType } from 'frontend-common';
import { Location } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Action, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import RunsPage from '../pages/runsPage.component';
import VisualisationsPage from '../pages/visualisationsPage.component';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: '64px',
        },
    }),
);

class PluginPlaceHolder extends React.Component<{ id: string; buttonClick: () => void }> {
    public render(): React.ReactNode {
        const { id, buttonClick } = this.props;
        return (
            <div>
                <div id={id}>{id} failed to load correctly</div>
                <button onClick={buttonClick}>Click me!</button>
            </div>
        );
    }
}

interface RoutingProps {
    plugins: RegisterRoutePayload[];
    location: Location;
}

interface RoutingDispatchProps {
    sendNotification: (message: string) => Action;
}

const Routing = (props: RoutingProps & RoutingDispatchProps): React.ReactElement => {
    const classes = useStyles();
    const { plugins, location, sendNotification } = props;

    React.useEffect(() => {
        console.log('Changed location: ', location);
    }, [location]);

    const clickedButton = () => {
        sendNotification(`I clicked the button at ${new Date().toLocaleString()}`);
    };

    return (
        <div className={classes.root}>
            <Switch location={location}>
                {/* <Route
                    exact
                    path="/"
                    render={() => (
                        <a style={{ margin: '64px' }} href="/runs/1/visualisations/test/data">
                            Test
                        </a>
                    )}
                /> */}
                <Route exact path="/" component={RunsPage} />
                <Route
                    exact
                    path="/runs/:runId/visualisations"
                    render={({ match }: RouteComponentProps<{ runId: string }>) => (
                        <VisualisationsPage runId={match.params.runId} />
                    )}
                />
                {plugins.map((p) => (
                    <Route
                        key={`${p.section}_${p.link}`}
                        exact
                        path={p.link}
                        render={() => <PluginPlaceHolder id={p.plugin} buttonClick={clickedButton} />}
                    />
                ))}
            </Switch>
        </div>
    );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, null, AnyAction>): RoutingDispatchProps => ({
    sendNotification: (message: string) => dispatch(frontendNotification(message)),
});

const mapStateToProps = (state: StateType): RoutingProps => ({
    plugins: state.frontend.configuration.plugins,
    location: state.router.location,
});

export default connect(mapStateToProps, mapDispatchToProps)(Routing);
