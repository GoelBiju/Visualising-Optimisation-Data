import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { RegisterRoutePayload } from '../state/frontend.types';
import { StateType } from '../state/state.types';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: '64px',
        },
    }),
);

interface RoutingProps {
    plugins: RegisterRoutePayload[];
    location: string;
}

// TODO: Use this
// class PluginPlaceHolder extends React.PureComponent<{ id: string }> {
//     public render(): React.ReactNode {
//         const { id } = this.props;
//         return <div id={id}>{id} failed to load correctly</div>;
//     }
// }

const Routing = (props: RoutingProps): React.ReactElement => {
    const classes = useStyles();
    const { plugins } = props;
    return (
        <div className={classes.root}>
            <Switch>
                {/* <Route exact path="/" component={RunsPage} /> */}
                {/* <Route exact path="/:runId/visualisations" component={VisualisationsPage} /> */}

                {plugins.map((p) => (
                    <Route
                        key={`${p.section}_${p.link}`}
                        path={p.link}
                        render={() => <div id={p.plugin}>{p.displayName}</div>}
                    />
                ))}

                {/* <Route exact path="/one" render={() => <div>Exact</div>} />
            <Route render={() => <div>Test</div>} /> */}
            </Switch>
        </div>
    );
};

const mapStateToProps = (state: StateType): RoutingProps => ({
    plugins: state.frontend.plugins,
    location: state.router.location.pathname,
});

export default connect(mapStateToProps)(Routing);
