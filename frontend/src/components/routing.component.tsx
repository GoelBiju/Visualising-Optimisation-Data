import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { RegisterRoutePayload } from '../state/frontend.types';
import { StateType } from '../state/state.types';

interface RoutingProps {
    plugins: RegisterRoutePayload[];
    location: string;
}

const Routing = (props: RoutingProps): React.ReactNode => {
    const { plugins } = props;
    return (
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
    );
};

const mapStateToProps = (state: StateType): RoutingProps => ({
    plugins: state.frontend.plugins,
    location: state.router.location.pathname,
});

export default connect(mapStateToProps)(Routing);
