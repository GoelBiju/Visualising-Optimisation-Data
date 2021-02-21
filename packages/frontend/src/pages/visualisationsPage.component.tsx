import { Grid, makeStyles, Typography } from '@material-ui/core';
import { fetchRun, RegisterRoutePayload, Run, StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import VisualisationCard from './visualisationCard.component';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        padding: '15px',
    },
});

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
    const classes = useStyles();
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
        <div className={classes.root}>
            <Grid container spacing={3}>
                {selectedRun ? (
                    plugins.length > 0 ? (
                        plugins.map(
                            (p, i) =>
                                selectedRun.graphs.includes(p.plugin) && (
                                    <Grid key={i} item xs={3}>
                                        <VisualisationCard
                                            runId={runId}
                                            visualisationName={p.plugin}
                                            displayName={p.displayName}
                                        />
                                    </Grid>
                                ),
                        )
                    ) : (
                        <Typography>No plugins have been loaded for visualisation</Typography>
                    )
                ) : (
                    <Typography>Unable to fetch the selected run.</Typography>
                )}
            </Grid>
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
