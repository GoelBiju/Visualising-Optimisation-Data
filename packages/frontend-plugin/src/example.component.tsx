import { StateType } from "frontend-common";
import React from "react";
import { connect } from "react-redux";

interface ExampleComponentStateProps {
  notifications: string[];
}

const ExampleComponent = (
  props: ExampleComponentStateProps
): React.ReactElement => (
  <div>
    <p>{props.notifications}</p>
  </div>
);

const mapStateToProps = (state: StateType): ExampleComponentStateProps => {
  return {
    notifications: state.frontend.notifications,
  };
};

export default connect(mapStateToProps)(ExampleComponent);
