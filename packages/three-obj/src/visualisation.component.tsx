import { Data, StateType } from "frontend-common";
import React from "react";
// import { connect } from "react-redux";

import createPlotlyComponent from "react-plotly.js/factory";
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

/**
 * Create two arrays num length with random values from 0 to mul
 *
 * @param {*} num
 * @param {*} mul
 * @returns
 */
function randomValues(num: number, mul: number) {
  const arr = [];
  const index = [];
  for (let i = 0; i < num; i++) {
    arr.push(Math.random() * mul);
    index.push(i);
  }
  return { index, arr };
}

interface VCProps {
  data: Data;
}

const VisualisationComponent = (): React.ReactElement => {
  // props: VCProps

  // const data = [
  //   {
  //     x: [1, 2, 3],
  //     y: [2, 6, 3],
  //     type: "scatter",
  //     mode: "lines+markers",
  //     marker: { color: "red" },
  //   },
  //   { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
  // ];

  // const data = [
  //   {
  //     x: [1, 2, 3],
  //     y: [2, 6, 3],
  //     type: "scatter",
  //     mode: "lines+markers",
  //     marker: { color: "red" },
  //   },
  //   { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
  // ] as Plotly.Data[];

  // var trace1 = {
  //   x: [1, 2, 3, 4],
  //   y: [10, 15, 13, 17],
  //   mode: "markers",
  //   type: "scatter",
  // };

  // var trace2 = {
  //   x: [2, 3, 4, 5],
  //   y: [16, 5, 11, 9],
  //   mode: "lines",
  //   type: "scatter",
  // };

  // var trace3 = {
  //   x: [1, 2, 3, 4],
  //   y: [12, 9, 15, 12],
  //   mode: "lines+markers",
  //   type: "scatter",
  // };

  // var data = [trace1, trace2, trace3] as Plotly.Data[];

  const traces = Array(3)
    .fill(0)
    .map((_, i) => {
      const { index, arr } = randomValues(20, 3);
      return {
        x: Array(20).fill(i),
        y: index,
        z: arr,
        type: "scatter3d",
        mode: "lines",
      };
    }) as Plotly.Data[];

  return (
    <div id="chartContainer">
      {/* <Plot
        data={data}
        layout={{ width: 500, height: 500, title: "A Fancy Plot" }}
      /> */}
      <Plot
        data={traces}
        layout={{
          width: 900,
          height: 800,
          title: `Simple 3D Scatter`,
        }}
      />
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
