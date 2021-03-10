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

// TODO: * Be careful about where we place receiving data from sockets (prevent duplicate data)
//       * Prevent multiple event handlers (subcribed to state)
// TODO: * Wait until data has been received from server after firing request, before firing next request

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
    // setSubscribed: (subscribed: boolean) => Action;
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
        // setSubscribed,
        setData,
        fetchingData,
        unsubscribeFromGenerations,
    } = props;

    const [loadedRun, setLoadedRun] = React.useState(false);
    const [currentGeneration, setCurrentGeneration] = React.useState(-1);

    // Create a generation queue object in state
    const [generationQueue, setGenerationQueue] = React.useState<number[]>([]);

    // All data has already been received from backend
    const [dataComplete, setDataComplete] = React.useState(false);

    // Visualisation controls
    const [liveMode, setLiveMode] = React.useState(true);

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

    // Load run information
    React.useEffect(() => {
        console.log('Fetching run information');
        console.log('Loaded run: ', loadedRun);

        // Fetch the run information
        if (!loadedRun) {
            // Fetching the run information into state
            fetchRun(runId);

            // TODO: check if the visualisation name from the root
            //       is appropriate for this run (maybe do this before render)
            // Set the selected visualisation name when mounting the component
            setVisualisationName(pluginName);
            console.log('Set visualisation name to: ', pluginName);

            setLoadedRun(true);
        }
    }, [loadedRun]);

    // Handle setting up the connection/subscribing to data
    // TODO: This needs to be cleared up and checked
    React.useEffect(() => {
        console.log('Setting up connection');
        console.log('Loaded run: ', loadedRun);

        // Set up the connection to the backend
        // socketConnected
        if (!socket || !socket.connected) {
            // Start socket connection
            initiateSocket(runId);
        } else {
            // TODO: We only need to subscribe to generation if the run isn't complete
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
                    if (data && data.completed) {
                        setDataComplete(true);
                        setLoadedRun(false);
                        console.log('Set loaded run to false');
                    }
                });

                // Subscribe to the data from the optimisation run room
                subscribeToGenerations(runId);
            }
        }
    }, [socket, subscribed]);

    // Handle fetching new data on generation changes
    React.useEffect(() => {
        console.log('Got new update');
        console.log('Loaded run: ', loadedRun);

        // Fetch the data for the new generation
        if (selectedRun && socket && socket.connected) {
            if (currentGeneration < 0) {
                // Initialise current generation with current run information
                setCurrentGeneration(selectedRun.currentGeneration);
                console.log('Set current generation to: ', selectedRun.currentGeneration);

                pushToGQ(selectedRun.currentGeneration);
                console.log('Queue: ', generationQueue);
            } else {
                // Fetch data if there are currently no requests
                if (!fetchingData && !dataComplete) {
                    // Get the next generation to fetch
                    const generation = popFromGQ();
                    console.log('Next generation from queue: ', generation);
                    if (generation && generation !== -1) {
                        // TODO: Is this correct calling setCurrentGeneration here,
                        //       we could set the generation once we have received the data?
                        setCurrentGeneration(generation);

                        console.log(`Requesting data for generation ${generation}`);
                        fetchData(selectedRun.dataId, generation);
                    }
                }
            }
        }
    }, [selectedRun, socket, currentGeneration, fetchingData, dataComplete, generationQueue]);

    // BUG: This runs initially and sets loadedRun to false
    // // TODO: Pause and play the visualisation by catching live mode change
    // React.useEffect(() => {
    //     // Clear the queue
    //     setGenerationQueue([]);
    //     // Check if live mode is set to false
    //     if (!liveMode) {
    //         console.log('Got live mode set to false');
    //         // Unsubscribe from the run and generation information being sent
    //         unsubscribeFromGenerations(runId);
    //     } else {
    //         subscribeToGenerations(runId);
    //         console.log('Subscribing again');
    //         setLoadedRun(false);
    //     }
    // }, [liveMode]);

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
                                    <IconButton
                                        color="primary"
                                        onClick={() => setLiveMode((mode) => !mode)}
                                        disabled={selectedRun.completed}
                                    >
                                        {liveMode ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                                    </IconButton>
                                </Box>

                                <Box p={2}>
                                    {/* // TODO: Replay features; add functionality for replay control */}
                                    <IconButton color="secondary" disabled={liveMode}>
                                        <ReplayIcon fontSize="large">Replay</ReplayIcon>
                                    </IconButton>
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
                                        value={currentGeneration}
                                        disabled
                                    />
                                </Box>

                                <Box p={2}>
                                    <Button variant="contained" disabled>
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
                                            defaultValue={currentGeneration !== -1 ? currentGeneration : 0}
                                            valueLabelDisplay="on"
                                            marks
                                            min={1}
                                            max={selectedRun.totalGenerations}
                                            step={1}
                                            value={currentGeneration}
                                            // TODO: Needs onChange to handle changing
                                            //       generation by sliding
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
    // setSubscribed: (subscribed: boolean) => dispatch(setSubscribed(subscribed)),
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
