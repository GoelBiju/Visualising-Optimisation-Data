import { Data, StateType } from "frontend-common";
import React from "react";
import { connect } from "react-redux";

import createPlotlyComponent from "react-plotly.js/factory";

// Set up Plotly
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

interface VCProps {
  data?: Data;
  dev?: boolean;
}

const VisualisationComponent = (props: VCProps): React.ReactElement => {
  // const [builtChart, setBuiltChart] = React.useState(false);

  const [revision, setRevision] = React.useState(1);

  // Build or update chart when data changes
  React.useEffect(() => {
    // NOTE: Ensure you set the type of the data to receive
    //       (e.g. 2-dimensional array being "number[][]" as the type).
    let graphData: number[][] = [];

    // Receive data from frontend
    if (!props.dev) {
      if (props.data) {
        // Convert from the GenerationData/Array to the exact array type (number[][])
        graphData = props.data ? (props.data.data as number[][]) : [];
      } else {
        console.error("No data received in VisualisationComponent from App");
      }
    } else {
      if (props.dev) {
        // Place any plugin development/testing data here.
        graphData = [
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
        ];
      }
    }
    console.log("Render graph data: ", graphData);

    // Build chart initially otherwise update for data
    // if (!builtChart) {
    //   buildChart();
    //   setBuiltChart(true);
    // } else {
    //   updateChart(graphData);
    // }
  }, [props.data, props.dev]);

  var trace = {
    type: "parcoords",
    line: {
      color: "blue",
    },

    // TODO: We need to calculate the max/min from generation data
    //       in order to get the range values.
    // Pre-processing:
    //  1. Split the generation data into n arrays (depending on n objectives)
    //     Each array needs to only contain only the values to show on its respective y-axis for that objective
    dimensions: [
      {
        // range: [1, 5],
        // constraintrange: [1, 2],
        label: "Objective 1",
        values: [1, 4],
      },
      {
        // range: [1, 5],
        label: "Objective 2",
        values: [revision, 1.5],
        // tickvals: [1.5, 3, 4.5],
      },
      // {
      //   range: [1, 5],
      //   label: "C",
      //   values: [2, 4],
      //   tickvals: [1, 2, 4, 5],
      //   ticktext: ["text 1", "text 2", "text 4", "text 5"],
      // },
      // {
      //   range: [1, 5],
      //   label: "D",
      //   values: [4, 2],
      // },
    ],
  } as Plotly.Data;

  return (
    <div id="chartContainer">
      <Plot
        data={[trace]}
        layout={{
          width: 900,
          height: 800,
          title: `Parallel Coordinate Plot (PCP)`,
        }}
        revision={revision}
      />
      <button onClick={() => setRevision(revision + 1)}>Increment</button>
      {revision}
    </div>
  );
};

const mapStateToProps = (state: StateType): VCProps => {
  return {
    data: state.frontend.data,
  };
};

export const DevVisualisationComponent = () => <VisualisationComponent dev />;
export default connect(mapStateToProps)(VisualisationComponent);
