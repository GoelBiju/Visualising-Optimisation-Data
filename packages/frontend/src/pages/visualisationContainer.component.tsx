import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Data,
    fetchData,
    fetchRun,
    initiateSocket,
    Run,
    setData,
    setSubscribed,
    setVisualisationName,
    StateType,
    subscribeToGenerations,
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
    setSubscribed: (subscribed: boolean) => Action;
    setData: (data: Data) => Action;
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
        setSubscribed,
        setData,
        fetchingData,
    } = props;

    const [loadedRun, setLoadedRun] = React.useState(false);
    const [currentGeneration, setCurrentGeneration] = React.useState(-1);

    // Create a generation queue object in state
    const [generationQueue, setGenerationQueue] = React.useState<number[]>([]);

    // All data has already been received from backend
    const [dataComplete, setDataComplete] = React.useState(false);

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
        // Fetch the run information
        if (!loadedRun) {
            // Fetching the run information into state
            fetchRun(runId);

            // Set the selected visualisation name
            // TODO: check if the visualisation name from the root
            //       is appropriate for this run (maybe do this before render)
            setVisualisationName(pluginName);

            setLoadedRun(true);
        }
    }, [loadedRun]);

    // Handle setting up the connection/subscribing to data
    // TODO: Fires multiple times
    // TODO: This needs to be cleared up and checked
    React.useEffect(() => {
        console.log('Setting up connection');

        // Set up the connection to the backend
        // socketConnected
        if (!socket || !socket.connected) {
            // Start socket connection
            initiateSocket(props.runId);
        } else {
            // If the socket is connected and not subscribed,
            // proceed to subcribe to the optimisation run
            if (socket && socket.connected && !subscribed) {
                // Subscribe to the data from the optimisation run room
                subscribeToGenerations(runId);

                // Set subscribed
                // socket.on('subscribed', (runId: string) => {
                //     console.log('Subscribed to: ', runId);
                // });

                // When we receive "subscribed" from
                // server attach the callback function
                socket.on('generation', (generation: number) => {
                    // setCurrentGeneration(generation);

                    // Add the generation to the queue.
                    // generationQueue.push(generation);
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
                    }
                });

                setSubscribed(true);
            }
        }
    }, [socket, subscribed]);

    // TODO: Ensure this does not request multiple times
    // Handle fetching new data on generation changes
    React.useEffect(() => {
        console.log('Got new update');

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
                    console.log(generationQueue);
                    const generation = popFromGQ();
                    console.log('generation from queue: ', generation);
                    if (generation && generation !== -1) {
                        // TODO: Is this correct calling setCurrentGeneration here?
                        setCurrentGeneration(generation);

                        console.log('Requesting data');
                        fetchData(selectedRun.dataId, generation);
                    }
                }
            }
        }
    }, [selectedRun, socket, currentGeneration, fetchingData, dataComplete, generationQueue]);

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

                                    <p>
                                        <b>Status</b>: {!selectedRun.completed ? 'Running' : 'Completed'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs>
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
    setSubscribed: (subscribed: boolean) => dispatch(setSubscribed(subscribed)),
    setData: (data: Data) => dispatch(setData(data)),
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
