import { fetchRuns, Run, StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

interface RunsPageDispatchProps {
    fetchRuns: () => Promise<void>;
}

interface RunsPageStateProps {
    runs: Run[];
}

type RunsPageCombinedProps = RunsPageDispatchProps & RunsPageStateProps;

const RunsPage = (props: RunsPageCombinedProps): React.ReactElement => {
    const { fetchRuns, runs } = props;
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
            {runs.map((r, i) => (
                <div key={i}>Test</div>
            ))}
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
