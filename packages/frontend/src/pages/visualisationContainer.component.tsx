import { Box, Button, Grid, IconButton, Paper, Slider, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import {
    Data,
    fetchData,
    fetchRun,
    initiateSocket,
    Run,
    setData,
    setVisualisationName,
    StateType,
    subscribeToGenerations,
    unsubscribeFromGenerations,
} from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { Action, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

const useStyles = makeStyles({
    content: {
        padding: '15px',
    },
    informationContent: {
        padding: '10px',
        textAlign: 'left',
    },
    generationTextField: {
        width: 150,
    },
    button: {
        display: 'flex',
        flexDirection: 'column',
    },
});

interface VCViewProps {
    runId: string;
    pluginName: string;
    children: React.ReactNode;
}

interface VCDispatchProps {
    fetchRun: (runId: string) => Promise<void>;
    setVisualisationName: (visualisationName: string) => Action;
    initiateSocket: (runId: string) => Promise<void>;
    subscribeToGenerations: (runId: string) => Promise<void>;
    fetchData: (dataId: string, generation: number) => Promise<void>;
    setData: (data: Data) => Action;
    unsubscribeFromGenerations: (runId: string) => Promise<void>;
}

interface VCStateProps {
    selectedRun: Run | null;
    selectedVisualisation: string;
    socket: SocketIOClient.Socket | null;
    subscribed: boolean;
    fetchingData: boolean;
}

type VCProps = VCViewProps & VCDispatchProps & VCStateProps;

// TODO:
//  - Replay should in a live run
//  - Replay should work on a completed run
//  - Should be able to press live button to return to latest generation from replay mode
//  - Should go back to live mode after replay is complete
// When the replay mode button is pressed,
// we replay from the first generation until the current generation.

// BUG: When pressing live button after turning on replay mode, it does not move to the latest generation but
//      stays at the generation it was last on before hitting the live button (could be related to clearing the queue and
//      the next run information loading)
// BUG: We keep on fetching the run information when a run is complete due to data.completed,
//      this is also causing issues with the replay mode requesting run after every data request

const VisualisationContainer = (props: VCProps): React.ReactElement => {
    const classes = useStyles();

    const {
        socket,
        initiateSocket,
        fetchRun,
        setVisualisationName,
        runId,
        pluginName,
        selectedRun,
        selectedVisualisation,
        subscribeToGenerations,
        fetchData,
        subscribed,
        setData,
        fetchingData,
        unsubscribeFromGenerations,
    } = props;

    // Set when we have fetched run information
    const [loadedRun, setLoadedRun] = React.useState(false);

    // Current generation stored only for this component
    // (different from run stored in state); allows for pause/play
    const [currentGeneration, setCurrentGeneration] = React.useState(-1);

    // Values for the controls (textfield and slider) which hold the value
    // of current generation but allows for the component using it to have
    // it adjusted for its own use.
    const [viewValue, setViewValue] = React.useState(-1);
    const [sliderValue, setSliderValue] = React.useState(-1);
    const [controlsMax, setControlsMax] = React.useState(0);

    // Create a generation queue object in state
    const [generationQueue, setGenerationQueue] = React.useState<number[]>([]);

    // Visualisation controls
    const [liveMode, setLiveMode] = React.useState(true);
    const [replayMode, setReplayMode] = React.useState(false);

    // Add generation to the queue (enqueue)
    const pushToGQ = (generation: number) => {
        setGenerationQueue([...generationQueue, generation]);
    };

    // Remove a generation (dequeue)
    const popFromGQ = (): number => {
        if (!isEmpty()) {
            const n = generationQueue.shift();
            console.log('Returning n: ', -1);
            if (n) {
                return n;
            } else {
                return -1;
            }
        } else {
            console.log('Queue empty');
            return -1;
        }
    };

    // Check if the queue is empty
    const isEmpty = (): boolean => {
        if (generationQueue.length === 0) {
            return true;
        } else {
            return false;
        }
    };

    // Set the selected visualisation name when mounting the component
    React.useEffect(() => {
        // TODO: Check if the visualisation name from the root
        //       is appropriate for this run (maybe do this before render)
        setVisualisationName(pluginName);
        console.log('Set visualisation name to: ', pluginName);
    }, []);

    // Load run information
    React.useEffect(() => {
        console.log('Fetching run information');
        console.log('Loaded run: ', loadedRun);

        // Fetch the run information
        if (!loadedRun) {
            // Fetching the run information into state
            fetchRun(runId);

            setLoadedRun(true);
        }
    }, [loadedRun]);

    // Handle setting up the connection/subscribing to data
    React.useEffect(() => {
        // Set up the connection to the backend
        // socketConnected
        if (!socket || !socket.connected) {
            // Start socket connection
            initiateSocket(runId);
        } else {
            // If the socket is connected and not subscribed and we are in live mode,
            // proceed to subcribe to the optimisation run
            if (socket && socket.connected && !subscribed && liveMode) {
                // When we receive "subscribed" from
                // server attach the callback function
                socket.on('generation', (generation: number) => {
                    // Add the generation to the queue.
                    pushToGQ(generation);
                    console.log('Generation added to queue: ', generation);
                    console.log('Queue: ', generationQueue);
                });

                // Handle the data response event
                socket.on('data', (data: Data) => {
                    console.log('Data received for current generation: ', data);
                    setData(data);

                    // If this the final data, then reload the run information
                    if (data) {
                        // Set the current generation from the data
                        // setCurrentGeneration(data.generation);
                        setGenerationValue(data.generation);

                        // TODO: If the data was complete, we should not
                        //       need to re-subscribe anymore
                        // If at any point the server returns that the data
                        // has been completed, update the run information.
                        if (data.completed) {
                            setLoadedRun(false);
                            console.log('Set loaded run to false');
                        }
                    }
                });

                // TODO: We only need to subscribe to generation if the run isn't complete
                // Subscribe to the data from the optimisation run room
                subscribeToGenerations(runId);
            }
        }
    }, [socket, subscribed]);

    React.useEffect(() => {
        // Fetch the data for the new generation
        if (socket && socket.connected && selectedRun) {
            if (currentGeneration < 0) {
                console.log('Pushing to queue: ', selectedRun.currentGeneration);
                pushToGQ(selectedRun.currentGeneration);
                console.log('Queue: ', generationQueue);
            }
        }
    }, [socket, selectedRun]);

    // Handle fetching new data on generation queue changes
    React.useEffect(() => {
        console.log(generationQueue);
        // Fetch data if there are currently no requests
        if (selectedRun && !fetchingData) {
            // Get the next generation to fetch
            const generation = popFromGQ();
            console.log('Next generation from queue: ', generation);
            if (generation && generation !== -1) {
                console.log(`Requesting data for generation ${generation}`);
                fetchData(selectedRun.dataId, generation);
            }
        }
    }, [fetchingData, generationQueue]);

    // Pause and play the visualisation by catching live mode change
    const handleLiveMode = (mode: boolean): void => {
        // Clear the queue
        setGenerationQueue([]);

        // Check if live mode is set to false
        if (!mode) {
            console.log('Got live mode set to false');
            // Unsubscribe from the run and generation information being sent
            unsubscribeFromGenerations(runId);

            // Set the slider maximum when live is turned off
            // (this is to get the maximum slidable value at this time)
            setControlsMax(currentGeneration);
        } else {
            // Subscribe again to the generations
            subscribeToGenerations(runId);
            console.log('Subscribing again');
            setLoadedRun(false);

            // TODO: * This is one of way of resetting, the slider however
            //       moves back to -1 and then jumps to the current value.
            // Reset the current generations
            // setCurrentGeneration(-1);
            setGenerationValue(-1);
        }

        // Set the live mode value
        setLiveMode(mode);
    };

    // Set generation value for all variables which need it
    const setGenerationValue = (value: number) => {
        setCurrentGeneration(value);
        setViewValue(value);
        setSliderValue(value);
    };

    // Convert seconds to DHMS format
    const secondsToDHMS = (seconds: number): string => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const dDisplay = d > 0 ? d + (d === 1 ? ' day' : ' days') + (h + m + s > 0 ? ', ' : '') : '';
        const hDisplay = h > 0 ? h + (h === 1 ? ' hour' : ' hours') + (m + s > 0 ? ', ' : '') : '';
        const mDisplay = m > 0 ? m + (s > 0 ? ' min, ' : ' min') : '';
        const sDisplay = s > 0 ? s + ' sec' : '';

        return dDisplay + hDisplay + mDisplay + sDisplay || '< 1 second';
    };

    return (
        <Grid container>
            {selectedRun && (
                <Grid item xs>
                    <Paper
                        square
                        style={{
                            backgroundColor: 'inherit',
                            height: '100%',
                            display: 'flex',
                        }}
                    >
                        <Typography style={{ margin: '5px' }}>
                            <b>Visualisation Name:</b> {selectedVisualisation} <i>({selectedRun._id})</i>
                        </Typography>
                    </Paper>
                </Grid>
            )}

            <Grid style={{ textAlign: 'center' }} item sm={3} xs={4}>
                <Paper
                    square
                    style={{
                        backgroundColor: 'inherit',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography>
                        <b>Current Generation:</b> {currentGeneration}
                    </Typography>
                </Paper>
            </Grid>

            <Grid className={classes.content} container direction="row" justify="center" spacing={2}>
                <Grid item xs={3}>
                    <Paper square>
                        {selectedRun && (
                            <div>
                                <Typography>
                                    <b>Run Details</b>
                                </Typography>

                                <div className={classes.informationContent}>
                                    <p>
                                        <b>Algorithm</b>: {selectedRun.algorithm}
                                    </p>

                                    <p>
                                        <b>Population Size</b>: {selectedRun.populationSize}
                                    </p>

                                    {selectedRun.algorithmParameters &&
                                        Object.entries(selectedRun.algorithmParameters).map(([name, value], index) => (
                                            <p key={index}>
                                                <b>{name}</b>: {value}
                                            </p>
                                        ))}

                                    <p>
                                        <b>Created</b>: {new Date(selectedRun.createdAt).toLocaleString()}
                                    </p>

                                    {selectedRun.completed && (
                                        <div>
                                            <p>
                                                <b>Completed</b>: {new Date(selectedRun.updatedAt).toLocaleString()}
                                            </p>

                                            <p>
                                                <b>Run duration</b>:{' '}
                                                {secondsToDHMS(
                                                    (new Date(selectedRun.updatedAt).getTime() -
                                                        new Date(selectedRun.createdAt).getTime()) /
                                                        1000,
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    <p>
                                        <b>Status</b>: {!selectedRun.completed ? 'Running' : 'Completed'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </Paper>

                    {/* Visualisation controls:
                            - Text box to view a generation
                            - Live/Pause buttons
                            - Replay button (enabled only when paused) 
                    */}
                    {selectedRun && (
                        <Paper square style={{ marginTop: '10px' }}>
                            <Typography>
                                <b>Visualisation Controls</b>
                            </Typography>

                            <Box display="flex" flexDirection="row" justifyContent="center">
                                <Box p={2}>
                                    <div className={classes.button}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleLiveMode(!liveMode)}
                                            disabled={liveMode && selectedRun.completed}
                                        >
                                            {liveMode ? (
                                                <PauseIcon fontSize="large" />
                                            ) : (
                                                <PlayArrowIcon fontSize="large" />
                                            )}
                                        </IconButton>
                                        {liveMode ? 'Pause' : 'Live'}
                                    </div>
                                </Box>

                                <Box p={2}>
                                    <div className={classes.button}>
                                        {/* TODO: Replay features; add functionality for replay control */}
                                        <IconButton
                                            color="secondary"
                                            disabled={replayMode || (liveMode && !selectedRun.completed)}
                                        >
                                            <ReplayIcon fontSize="large">Replay</ReplayIcon>
                                        </IconButton>
                                        Replay
                                    </div>
                                </Box>
                            </Box>

                            <Box display="flex" flexDirection="row" justifyContent="center">
                                <Box p={2}>
                                    <TextField
                                        className={classes.generationTextField}
                                        id="generation-textfield"
                                        label="Generation"
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        value={viewValue}
                                        InputProps={{
                                            inputProps: {
                                                min: 0,
                                                max: liveMode ? selectedRun.totalGenerations : controlsMax,
                                            },
                                        }}
                                        onChange={(e) => setViewValue(parseInt(e.target.value))}
                                        disabled={liveMode && !selectedRun.completed}
                                    />
                                </Box>

                                <Box p={2}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        disabled={liveMode && !selectedRun.completed}
                                        onClick={() => pushToGQ(viewValue)}
                                    >
                                        View
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    )}
                </Grid>

                <Grid item xs>
                    <Box display="flex" flexDirection="column">
                        <Box>
                            <Paper square>
                                {selectedRun && (
                                    <div>
                                        <Typography variant="h6">
                                            <b>{selectedRun.title}</b>
                                        </Typography>
                                    </div>
                                )}

                                {/* NOTE: Do not make this render based on any other variable (e.g. selectedRun), 
                                          otherwise the plugin may not load */}
                                {props.children}
                            </Paper>
                        </Box>

                        {/* Slider to control generations */}
                        {selectedRun && (
                            <Box style={{ marginTop: '10px' }}>
                                <Paper square>
                                    <Typography>
                                        <b>Generation Slider</b>
                                    </Typography>

                                    <div style={{ margin: '10px' }}>
                                        <Slider
                                            value={sliderValue}
                                            defaultValue={sliderValue !== -1 ? sliderValue : 0}
                                            onChange={(e, v) => setSliderValue(v as number)}
                                            onChangeCommitted={(e, v) => {
                                                console.log('New value: ', v);
                                                // Request to fetch the new data.
                                                pushToGQ(v as number);
                                            }}
                                            min={1}
                                            max={liveMode ? selectedRun.totalGenerations : controlsMax}
                                            step={1}
                                            marks
                                            valueLabelDisplay={!selectedRun.completed ? 'on' : 'auto'}
                                        />
                                    </div>
                                </Paper>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, null, AnyAction>): VCDispatchProps => ({
    fetchRun: (runId: string) => dispatch(fetchRun(runId)),
    setVisualisationName: (visualisationName: string) => dispatch(setVisualisationName(visualisationName)),
    initiateSocket: (runId: string) => dispatch(initiateSocket(runId)),
    subscribeToGenerations: (runId: string) => dispatch(subscribeToGenerations(runId)),
    fetchData: (dataId: string, generation: number) => dispatch(fetchData(dataId, generation)),
    setData: (data: Data) => dispatch(setData(data)),
    unsubscribeFromGenerations: (runId: string) => dispatch(unsubscribeFromGenerations(runId)),
});

const mapStateToProps = (state: StateType): VCStateProps => {
    return {
        socket: state.frontend.configuration.socket,
        selectedRun: state.frontend.selectedRun,
        selectedVisualisation: state.frontend.selectedVisualisation,
        subscribed: state.frontend.configuration.subscribed,
        fetchingData: state.frontend.fetchingData,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationContainer);
