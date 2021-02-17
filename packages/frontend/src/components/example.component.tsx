import { StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';

interface ExampleComponentProps {
    notifications: string[];
}

const ExampleComponent = (props: ExampleComponentProps): React.ReactElement => <div>{props.notifications}</div>;

const mapStateToProps = (state: StateType): ExampleComponentProps => {
    return {
        notifications: state.frontend.notifications,
    };
};

export default connect(mapStateToProps)(ExampleComponent);
