import { Grid, Paper, Typography } from '@material-ui/core';
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

// TODO: Use queue (in state?)
// TODO: Try to instead of having an object, store the list in the component
//       then perform actions using setState on the list.
// class GenerationQueue {
//     generations: number[];

//     constructor() {
//         this.generations = [];
//     }

//     // Add a generation (enqueue)
//     push(generation: number): void {
//         this.generations.push(generation);
//     }

//     // Remove a generation (dequeue)
//     pop(): number | undefined {
//         if (!this.isEmpty()) {
//             console.log('Returning number');
//             return this.generations.shift();
//         } else {
//             return -1;
//         }
//     }

//     // Check if the queue is empty
//     isEmpty(): boolean {
//         if (this.generations.length === 0) {
//             return true;
//         } else {
//             return false;
//         }
//     }
// }

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
    // const [generationQueue] = React.useState(new GenerationQueue());
    const [generationQueue, setGenerationQueue] = React.useState<number[]>([]);

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

    // TODO: * Be careful about where we place receiving data from sockets (prevent duplicate data)
    //       * Prevent multiple event handlers (subcribed to state)
    // TODO: * Wait until data has been received from server after firing request, before firing next request

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
                if (!fetchingData) {
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
    }, [selectedRun, socket, currentGeneration, fetchingData, generationQueue]);

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
                        <Typography>
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

            <Grid item xs={12}>
                {props.children}
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
