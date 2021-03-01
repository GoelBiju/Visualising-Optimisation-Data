import { createStyles, makeStyles } from '@material-ui/core/styles';
import { RegisterRoutePayload, StateType } from 'frontend-common';
import { Location } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router';
import RunsPage from '../pages/runsPage.component';
import VisualisationContainer from '../pages/visualisationContainer.component';
import VisualisationsPage from '../pages/visualisationsPage.component';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: '64px',
        },
    }),
);

class PluginPlaceHolder extends React.Component<{ id: string }> {
    public render(): React.ReactNode {
        const { id } = this.props;
        return (
            <div>
                <div id={id}>{id} failed to load correctly</div>
            </div>
        );
    }
}

interface RoutingProps {
    plugins: RegisterRoutePayload[];
    location: Location;
}

const Routing = (props: RoutingProps): React.ReactElement => {
    const classes = useStyles();
    const { plugins, location } = props;

    React.useEffect(() => {
        console.log('Changed location: ', location);
    }, [location]);

    return (
        <div className={classes.root}>
            <Switch location={location}>
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
                        // TODO: Put the expected location here instead of the plugin
                        path={`/runs/:runId/visualisations/${p.plugin}/data`}
                        // render={() => <PluginPlaceHolder id={p.plugin} buttonClick={clickedButton} />}
                        render={({ match }: RouteComponentProps<{ runId: string; visualisationName: string }>) => (
                            <VisualisationContainer runId={match.params.runId} pluginName={p.plugin}>
                                <PluginPlaceHolder id={p.plugin} />
                            </VisualisationContainer>
                        )}
                    />
                ))}
            </Switch>
        </div>
    );
};

const mapStateToProps = (state: StateType): RoutingProps => ({
    plugins: state.frontend.configuration.plugins,
    location: state.router.location,
});

export default connect(mapStateToProps)(Routing);
