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
  // let trace = {
  //   type: "parcoords",
  //   line: {
  //     color: "blue",
  //   },

  //   // TODO: We need to calculate the max/min from generation data
  //   //       in order to get the range values.
  //   // Pre-processing:
  //   //  1. Split the generation data into n arrays (depending on n objectives)
  //   //     Each array needs to only contain only the values to show on its respective y-axis for that objective
  //   dimensions: [
  //     {
  //       label: "Objective 1",
  //       values: [1, 4],
  //       // range: [1, 5],
  //       // constraintrange: [1, 2],
  //       // tickvals: [1, 2, 4, 5],
  //       // ticktext: ["text 1", "text 2", "text 4", "text 5"],
  //     },
  //     {
  //       label: "Objective 2",
  //       values: [0, 1.5],
  //     },
  //   ],
  // } as Plotly.Data;

  const [data, setData] = React.useState<number[][]>([]);

  // Build or update chart when data changes
  React.useEffect(() => {
    let graphData: number[][] = [];

    // Receive data from frontend
    if (!props.dev) {
      if (props.data) {
        // NOTE: Ensure you set the type of the data to receive
        //       (e.g. 2-dimensional array being "number[][]" as the type).
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
    setData(graphData as number[][]);
    console.log("Render graph data: ", graphData);
  }, [props.data, props.dev]);

  return (
    <div id="chartContainer">
      <Plot
        layout={{
          width: 670,
          height: 370,
          title: `Parallel Coordinate Plot (PCP)`,
        }}
        data={[
          {
            type: "parcoords",
            line: {
              color: "blue",
            },
            dimensions: [
              {
                label: "Objective 1",
                values: data.map((x) => x[0]),
              },
              {
                label: "Objective 2",
                values: data.map((x) => x[1]),
              },
            ],
          } as Plotly.Data,
        ]}
      />
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
