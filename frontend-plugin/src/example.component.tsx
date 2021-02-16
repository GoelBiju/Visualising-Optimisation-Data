import { RouterState } from "connected-react-router";
import React from "react";
import { connect } from "react-redux";

export interface RegisterRoutePayload {
  section: string;
  link: string;
  plugin: string;
  displayName: string;
}

export interface FrontendState {
  notifications: string[];
  plugins: RegisterRoutePayload[];
}

export interface StateType {
  frontend: FrontendState;
  router: RouterState;
}

interface ExampleComponentProps {
  notifications: string[];
}

const ExampleComponent = (props: ExampleComponentProps): React.ReactElement => (
  <div>{props.notifications}</div>
);

const mapStateToProps = (state: StateType): ExampleComponentProps => {
  return {
    notifications: state.frontend.notifications,
  };
};

export default connect(mapStateToProps)(ExampleComponent);
