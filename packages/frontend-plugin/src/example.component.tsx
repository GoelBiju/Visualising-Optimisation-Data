import { StateType } from "frontend-common";
import React from "react";
import { connect } from "react-redux";

interface ExampleComponentStateProps {
  notifications: string[];
}

interface ExampleComponentProps {
  runId: string;
  visualisationName: string;
}

const ExampleComponent = (
  props: ExampleComponentProps & ExampleComponentStateProps
): React.ReactElement => (
  <div>
    <p>{props.notifications}</p>
    <p>{props.runId}</p>
    <p>{props.visualisationName}</p>
  </div>
);

const mapStateToProps = (state: StateType): ExampleComponentStateProps => {
  return {
    notifications: state.frontend.notifications,
  };
};

export default connect(mapStateToProps)(ExampleComponent);
