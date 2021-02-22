import {
    fetchRun,
    initiateSocket,
    Run,
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
}

interface VCStateProps {
    selectedRun: Run | null;
    selectedVisualisation: string;
    socket: SocketIOClient.Socket | null;
    socketConnected: boolean;
}

type VCProps = VCViewProps & VCDispatchProps & VCStateProps;

const VisualisationContainer = (props: VCProps): React.ReactElement => {
    const {
        socketConnected,
        initiateSocket,
        fetchRun,
        setVisualisationName,
        runId,
        pluginName,
        selectedRun,
        selectedVisualisation,
        subscribeToGenerations,
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

        if (socketConnected && !subscribed) {
            // Subscribe to the data from the optimisation run room
            subscribeToGenerations(runId);

            setSubscribed(true);
        }
    }, [socketConnected, subscribed]);

    return (
        <div>
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
});

const mapStateToProps = (state: StateType): VCStateProps => {
    return {
        selectedRun: state.frontend.selectedRun,
        selectedVisualisation: state.frontend.selectedVisualisation,
        socket: state.frontend.configuration.socket,
        socketConnected: state.frontend.configuration.socketConnected,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationContainer);
