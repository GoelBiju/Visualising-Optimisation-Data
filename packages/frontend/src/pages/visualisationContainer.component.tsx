import { fetchRun, initiateSocket, Run, StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
interface VCViewProps {
    runId: string;
    pluginName: string;
}

interface VCDispatchProps {
    fetchRun: (runId: string) => Promise<void>;
    initiateSocket: (runId: string) => Promise<void>;
}

interface VCStateProps {
    selectedRun: Run | null;
    selectedVisualisation: string;
    socket: SocketIOClient.Socket | null;
    socketConnected: boolean;
}

type VCProps = VCViewProps & VCDispatchProps & VCStateProps;

const VisualisationContainer = (props: VCProps): React.ReactElement => {
    const { socketConnected, initiateSocket, fetchRun, runId, pluginName, selectedRun, selectedVisualisation } = props;

    const [loadedRun, setLoadedRun] = React.useState(false);

    const [visualisationName, setVisualisationName] = React.useState('');

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

        // Set up the connection to the backend
        if (!socketConnected) {
            // Start socket connection
            initiateSocket(props.runId);

            // Subscribe to the data from the optimisation run room
        }
    }, [loadedRun, selectedRun, selectedVisualisation, socketConnected]);

    return (
        <div>
            {selectedRun && (
                <div>
                    <p>Run ID: {selectedRun._id}</p>
                    <p>Visualisation Name: {visualisationName}</p>
                </div>
            )}
        </div>
    );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, null, AnyAction>): VCDispatchProps => ({
    fetchRun: (runId: string) => dispatch(fetchRun(runId)),
    initiateSocket: (runId: string) => dispatch(initiateSocket(runId)),
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
