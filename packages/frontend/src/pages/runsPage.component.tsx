import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchRuns, Run, StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import RunCard from './runCard.component';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        padding: '15px',
    },
    label: { padding: '15px', textAlign: 'left' },
});

interface RunsPageDispatchProps {
    fetchRuns: () => Promise<void>;
}

interface RunsPageStateProps {
    runs: Run[];
}

type RunsPageCombinedProps = RunsPageDispatchProps & RunsPageStateProps;

const RunsPage = (props: RunsPageCombinedProps): React.ReactElement => {
    const classes = useStyles();
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
            <Typography className={classes.label} variant="h4">
                Active
            </Typography>

            <div className={classes.root}>
                <Grid container spacing={3}>
                    {runs
                        .filter((r) => !r.completed)
                        .map((run, index) => (
                            <Grid key={index} item xs={3}>
                                <RunCard
                                    id={run._id}
                                    title={run.title}
                                    problem={run.problem}
                                    created={run.createdAt}
                                    generations={run.generations}
                                    graphs={run.graphs}
                                />
                            </Grid>
                        ))}
                </Grid>
            </div>

            <Typography className={classes.label} variant="h4">
                Completed
            </Typography>

            <div className={classes.root}>
                <Grid container spacing={3}>
                    {runs
                        .filter((r) => r.completed)
                        .map((run, index) => (
                            <Grid key={index} item xs={3}>
                                <RunCard
                                    id={run._id}
                                    title={run.title}
                                    problem={run.problem}
                                    created={run.createdAt}
                                    generations={run.generations}
                                    graphs={run.graphs}
                                />
                            </Grid>
                        ))}
                </Grid>
            </div>
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
