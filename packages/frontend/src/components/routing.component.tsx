import { createStyles, makeStyles } from '@material-ui/core/styles';
import { RegisterRoutePayload, StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import RunsPage from '../pages/runsPage.component';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: '64px',
        },
    }),
);

// TODO: Use this
// class PluginPlaceHolder extends React.PureComponent<{ id: string }> {
//     public render(): React.ReactNode {
//         const { id } = this.props;
//         return <div id={id}>{id} failed to load correctly</div>;
//     }
// }

interface RoutingProps {
    plugins: RegisterRoutePayload[];
    location: string;
}

const Routing = (props: RoutingProps): React.ReactElement => {
    const classes = useStyles();
    const { plugins } = props;
    return (
        <div className={classes.root}>
            <Switch>
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
                {/* <Route exact path="/" component={RunsPage} /> */}
                {/* <Route exact path="/:runId/visualisations" component={VisualisationsPage} /> */}

                {plugins.map((p) => (
                    <Route
                        key={`${p.section}_${p.link}`}
                        exact
                        path={p.link}
                        render={() => <div id={p.plugin}>{p.displayName}</div>}
                    />
                ))}
            </Switch>
        </div>
    );
};

const mapStateToProps = (state: StateType): RoutingProps => ({
    plugins: state.frontend.configuration.plugins,
    location: state.router.location.pathname,
});

export default connect(mapStateToProps)(Routing);
