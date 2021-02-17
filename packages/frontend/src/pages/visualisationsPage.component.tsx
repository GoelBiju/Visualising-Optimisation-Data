import { List, ListItem } from '@material-ui/core';
import { fetchRun, RegisterRoutePayload, Run, StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import VisualisationCard from './visualisationCard.component';

interface VisualisationsPageProps {
    runId: string;
}

interface VisualisationsPageDispatchProps {
    fetchRun: (runId: string) => Promise<void>;
}

interface VisualisationsPageStateProps {
    selectedRun: Run | null;
    plugins: RegisterRoutePayload[];
}

type VisualisationsPageCombinedProps = VisualisationsPageProps &
    VisualisationsPageDispatchProps &
    VisualisationsPageStateProps;

const VisualisationsPage = (props: VisualisationsPageCombinedProps): React.ReactElement => {
    const { runId, fetchRun, plugins, selectedRun } = props;

    const [runsFetched, setRunsFetched] = React.useState(false);

    React.useEffect(() => {
        if (!runsFetched) {
            // Call to fetch runs.
            fetchRun(runId);
            setRunsFetched(true);
        }
    }, [runsFetched]);

    return (
        <div>
            <List>
                {selectedRun &&
                    plugins.map(
                        (p, i) =>
                            selectedRun.graphs.includes(p.plugin) && (
                                <ListItem key={i}>
                                    <VisualisationCard
                                        runId={runId}
                                        visualisationName={p.plugin}
                                        displayName={p.displayName}
                                    />
                                </ListItem>
                            ),
                    )}
            </List>
        </div>
    );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, null, AnyAction>): VisualisationsPageDispatchProps => ({
    fetchRun: (runId: string) => dispatch(fetchRun(runId)),
});

const mapStateToProps = (state: StateType): VisualisationsPageStateProps => {
    return {
        selectedRun: state.frontend.selectedRun, // get supported plugins for run
        plugins: state.frontend.configuration.plugins, // get loaded plugins
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationsPage);
