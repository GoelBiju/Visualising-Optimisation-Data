import { Data, StateType } from "frontend-common";
import React from "react";
import { connect } from "react-redux";
import * as Plotly from "plotly.js";

interface VCProps {
  data: Data;
}

const VisualisationComponent = (props: VCProps): React.ReactElement => {
  // const chartRef: React.RefObject<SVGSVGElement> = React.createRef<SVGSVGElement>();

  // const margin = {
  //   top: 50,
  //   right: 30,
  //   bottom: 30,
  //   left: 60,
  // };

  // const width = 760 - margin.left - margin.right;
  // const height = 450 - margin.top - margin.bottom;

  return <div id="chartContainer"></div>;
};

const mapStateToProps = (state: StateType): VCProps => {
  return {
    data: state.frontend.data,
  };
};

export default connect(mapStateToProps)(VisualisationComponent);
// export default VisualisationComponent;
