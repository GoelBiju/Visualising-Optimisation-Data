import { initiateSocket, StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
interface VCViewProps {
    runId: string;
    visualisationName: string;
}

interface VCDispatchProps {
    initiateSocket: (runId: string) => Promise<void>;
}

interface VCStateProps {
    socket: SocketIOClient.Socket | null;
    socketConnected: boolean;
}

type VCProps = VCViewProps & VCDispatchProps & VCStateProps;

const VisualisationContainer = (props: VCProps): React.ReactElement => {
    const { socketConnected, initiateSocket } = props;

    React.useEffect(() => {
        if (!socketConnected) {
            // Start socket connection
            initiateSocket(props.runId);

            // Subscribe to the data from the optimisation run room
        }
    }, [socketConnected]);

    return (
        <div>
            <p>Run ID: {props.runId}</p>
            <p>Visualisation Name: {props.visualisationName}</p>
        </div>
    );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, null, AnyAction>): VCDispatchProps => ({
    initiateSocket: (runId: string) => dispatch(initiateSocket(runId)),
});

const mapStateToProps = (state: StateType): VCStateProps => {
    return {
        socket: state.frontend.configuration.socket,
        socketConnected: state.frontend.configuration.socketConnected,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationContainer);
