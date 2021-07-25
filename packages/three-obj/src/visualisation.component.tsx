import { Data, StateType } from "frontend-common";
import React from "react";
import { connect } from "react-redux";

// import Plot from "react-plotly.js";

import createPlotlyComponent from "react-plotly.js/factory";
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

interface VCProps {
  data: Data;
}

const VisualisationComponent = (): React.ReactElement => {
  // props: VCProps
  return (
    <div id="chartContainer">
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
          },
          { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
        ]}
        layout={{ width: 500, height: 500, title: "A Fancy Plot" }}
      />
      {/* Test */}
    </div>
  );
};

const mapStateToProps = (state: StateType): VCProps => {
  return {
    data: state.frontend.data,
  };
};

// export default connect(mapStateToProps)(VisualisationComponent);
export default VisualisationComponent;
