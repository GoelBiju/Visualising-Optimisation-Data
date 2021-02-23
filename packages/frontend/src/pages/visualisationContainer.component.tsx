import {
    fetchData,
    fetchRun,
    initiateSocket,
    Run,
    runGenerationSuccess,
    setVisualisationName,
    StateType,
    subscribeToGenerations,
} from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { Action, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

interface VCViewProps {
    runId: string;
    pluginName: string;
}

interface VCDispatchProps {
    fetchRun: (runId: string) => Promise<void>;
    setVisualisationName: (visualisationName: string) => Action;
    initiateSocket: (runId: string) => Promise<void>;
    subscribeToGenerations: (runId: string) => Promise<void>;
    fetchData: (dataId: string, generation: number) => Promise<void>;
    setCurrentGeneration: (generation: number) => Action;
}

interface VCStateProps {
    selectedRun: Run | null;
    selectedVisualisation: string;
    socket: SocketIOClient.Socket | null;
    socketConnected: boolean;
    currentGeneration: number;
}

type VCProps = VCViewProps & VCDispatchProps & VCStateProps;

const VisualisationContainer = (props: VCProps): React.ReactElement => {
    const {
        socket,
        socketConnected,
        initiateSocket,
        fetchRun,
        setVisualisationName,
        runId,
        pluginName,
        selectedRun,
        selectedVisualisation,
        subscribeToGenerations,
        currentGeneration,
        fetchData,
        setCurrentGeneration,
    } = props;

    const [loadedRun, setLoadedRun] = React.useState(false);
    const [subscribed, setSubscribed] = React.useState(false);

    // Load run information
    React.useEffect(() => {
        // Fetch the run information
        if (!loadedRun) {
            // Fetching the run information into state
            fetchRun(runId);

            // Set the selected visualisation name
            // TODO: check if the visualisation from the root is appropriate for this run
            setVisualisationName(pluginName);

            setLoadedRun(true);
        }
    }, [loadedRun, selectedRun, selectedVisualisation]);

    // Socket connection
    React.useEffect(() => {
        // Set up the connection to the backend
        if (!socketConnected) {
            // Start socket connection
            initiateSocket(props.runId);
        }

        // If the socket is connected and not subscribed,
        // proceed to subcribe to the optimisation run
        if (socket && socketConnected && !subscribed) {
            // TODO: Should this event handler be here? Maybe move to the
            //       VisualisastionContainer component.
            // When we receive "subscribed" from
            // server attach the callback function
            socket.on('generation', (generation: number) => {
                console.log('Generation received: ', generation);
                setCurrentGeneration(generation);
            });

            // Handle the data response event
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            socket.on('data', (data: any) => {
                console.log('Data received for current generation', currentGeneration);
            });

            // Subscribe to the data from the optimisation run room
            subscribeToGenerations(runId);

            setSubscribed(true);
        }
    }, [socketConnected, subscribed]);

    // TODO: Ensure this does not request multiple times
    // Handle fetching new data on generation changes
    React.useEffect(() => {
        // Fetch the data for the new generation
        if (selectedRun && currentGeneration > 0) {
            fetchData(selectedRun.dataId, currentGeneration);
            console.log('Fetched data');
        }
    }, [selectedRun, currentGeneration]);

    return (
        <div>
            <div>Current Generation: {currentGeneration}</div>
            {selectedRun && (
                <div>
                    <p>Run ID: {selectedRun._id}</p>
                    <p>Visualisation Name: {selectedVisualisation}</p>
                </div>
            )}
        </div>
    );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, null, AnyAction>): VCDispatchProps => ({
    fetchRun: (runId: string) => dispatch(fetchRun(runId)),
    setVisualisationName: (visualisationName: string) => dispatch(setVisualisationName(visualisationName)),
    initiateSocket: (runId: string) => dispatch(initiateSocket(runId)),
    subscribeToGenerations: (runId: string) => dispatch(subscribeToGenerations(runId)),
    fetchData: (dataId: string, generation: number) => dispatch(fetchData(dataId, generation)),
    setCurrentGeneration: (generation: number) => dispatch(runGenerationSuccess(generation)),
});

const mapStateToProps = (state: StateType): VCStateProps => {
    return {
        socket: state.frontend.configuration.socket,
        socketConnected: state.frontend.configuration.socketConnected,
        selectedRun: state.frontend.selectedRun,
        selectedVisualisation: state.frontend.selectedVisualisation,
        currentGeneration: state.frontend.currentGeneration,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationContainer);
