import * as d3 from "d3";
// import { Data, StateType } from "frontend-common";
import React from "react";
// import { connect } from "react-redux";

// interface VCProps {
//   data: Data;
// }

const data = [
  [6.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 4.0],
  [7.0, 6.0, 6.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [7.0, 7.0, 6.0, 6.0, 6.0, 6.0, 6.0, 5.0, 5.0, 5.0],
  [7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0],
  [7.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 6.0, 6.0],
  [7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 6.0],
  [7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0],
  [7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0],
  [8.0, 8.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0],
  [8.0, 8.0, 8.0, 8.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 7.0, 7.0, 7.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 7.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0],
  [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0],
];

const VisualisationComponent = (): React.ReactElement => {
  // props: VCProps
  const chartRef: React.RefObject<SVGSVGElement> = React.createRef<SVGSVGElement>();

  const margin = {
    top: 50,
    right: 30,
    bottom: 30,
    left: 60,
  };

  const width = 760 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  const xScale: d3.ScaleLinear<number, number> = d3
    .scaleLinear()
    .range([0, width]);
  const yScale: d3.ScaleLinear<number, number> = d3
    .scaleLinear()
    .range([height, 0]);

  const [builtChart, setBuiltChart] = React.useState(false);

  // Get current chart a D3 selection
  const currentChart = React.useCallback(
    (): d3.Selection<SVGSVGElement | null, unknown, null, undefined> =>
      d3.select(chartRef.current),
    [chartRef]
  );

  // NOTE: Change this section to build the chart initially.
  const buildChart = React.useCallback(() => {
    // Adjust the svg.
    const svg = currentChart()
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add x axis
    const xAxis = xScale.domain([0, data.length]);
    svg
      .append("g")
      .attr("class", "line-chart-xaxis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xAxis));

    // TODO: this should be the max generations from the run info
    // Add y axis
    const yAxis = yScale.domain([0, 1.0]);
    svg.append("g").attr("class", "line-chart-yaxis").call(d3.axisLeft(yAxis));

    // Add line
    svg.append("path").attr("class", "line-chart-line");
  }, [
    currentChart,
    height,
    margin.bottom,
    margin.left,
    margin.right,
    margin.top,
    width,
    xScale,
    yScale,
  ]);

  // NOTE: Change this section to update the chart when with new data.
  const updateChart = React.useCallback(
    (data: number[][]) => {
      // Get the current SVG of the chart
      const svg = currentChart();

      // Update the x-axis with the maximum generation we have (length of the data)
      const xAxis = xScale.domain([0, data.length]);
      // NOTE: This is a shorthand to update the axis without using .call
      //       (using .call had type issues with .select).
      d3.axisBottom(xAxis)(svg.select("g.line-chart-xaxis"));

      // TODO: Y axis needs to be calculated based on: P+max(1, np.ceil(P/10))
      // Update the y-axis with the max of all the arrays
      const yAxis = yScale.domain([
        0,
        d3.max(data, (d) => d3.max(d)) as number,
      ]);
      d3.axisLeft(yAxis)(svg.select("g.line-chart-yaxis"));

      // TODO: Remove the old points
      // svg.selectAll("g.path").remove();

      var line = d3
        .line<number[]>()
        .x((_, i) => xScale(i) as number)
        .y((d: number[]) => yScale(d3.median(d) as number) as number);

      // Append the new line
      svg
        .select("path.line-chart-line")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    },
    [currentChart, xScale, yScale]
  );

  // Build or update chart when data changes
  React.useEffect(() => {
    // const data = props.data ? props.data.data : [];
    // console.log("Render: ", data);
    // const data: number[] | number[][] = []

    // Build chart initially otherwise update for data
    if (!builtChart) {
      buildChart();
      setBuiltChart(true);
    } else {
      updateChart(data);
    }
  }, [buildChart, builtChart, updateChart]); // props.data

  return (
    <div id="chartContainer">
      <svg ref={chartRef}></svg>
    </div>
  );
};

// const mapStateToProps = (state: StateType): VCProps => {
//   return {
//     data: state.frontend.data,
//   };
// };

// export default connect(mapStateToProps)(VisualisationComponent);
export default VisualisationComponent;
