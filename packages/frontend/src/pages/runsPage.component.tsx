import { List, ListItem } from '@material-ui/core';
import { fetchRuns, Run, StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import RunCard from '../components/runCard.component';

interface RunsPageDispatchProps {
    fetchRuns: () => Promise<void>;
}

interface RunsPageStateProps {
    runs: Run[];
}

type RunsPageCombinedProps = RunsPageDispatchProps & RunsPageStateProps;

const RunsPage = (props: RunsPageCombinedProps): React.ReactElement => {
    const { runs, fetchRuns } = props;
    console.log('Got runs: ', runs);

    const [runsFetched, setRunsFetched] = React.useState(false);

    React.useEffect(() => {
        if (!runsFetched) {
            // Call to fetch runs.
            fetchRuns();
            setRunsFetched(true);
        }
    }, [runsFetched]);

    return (
        <div>
            <List>
                {runs.map((run, index) => (
                    <ListItem key={index}>
                        <RunCard
                            id={run._id}
                            title={run.title}
                            problem={run.problem}
                            created={run.createdAt}
                            generations={run.generations}
                            graphs={run.graphs}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, null, AnyAction>): RunsPageDispatchProps => ({
    fetchRuns: () => dispatch(fetchRuns()),
});

const mapStateToProps = (state: StateType): RunsPageStateProps => {
    return {
        runs: state.frontend.runs,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RunsPage);
