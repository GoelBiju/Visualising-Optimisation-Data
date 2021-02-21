import { StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';

interface VCViewProps {
    runId: string;
    visualisationName: string;
}

interface VCStateProps {
    socket: SocketIOClient.Socket | null;
    socketConnected: boolean;
}

type VCProps = VCViewProps & VCStateProps;

const VisualisationContainer = (props: VCProps): React.ReactElement => (
    <div>
        <p>Run ID: {props.runId}</p>

        <p>Visualisation Name: {props.visualisationName}</p>
    </div>
);

const mapStateToProps = (state: StateType): VCStateProps => {
    return {
        socket: state.frontend.configuration.socket,
        socketConnected: state.frontend.configuration.socketConnected,
    };
};

export default connect(mapStateToProps)(VisualisationContainer);
