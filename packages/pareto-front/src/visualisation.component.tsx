import * as d3 from "d3";
import { Data, StateType } from "frontend-common";
import React from "react";
import { connect } from "react-redux";

interface VCProps {
  data: Data;
}

const VisualisationComponent = (props: VCProps): React.ReactElement => {
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

  // Build the chart initially.
  const buildChart = React.useCallback(() => {
    // Adjust the svg.
    const svg = currentChart()
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add x axis
    const xAxis = xScale.domain([0, 1.0]);
    svg
      .append("g")
      .attr("class", "scatter-chart-xaxis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xAxis));

    // Add y axis
    const yAxis = yScale.domain([0, 1.0]);
    svg
      .append("g")
      .attr("class", "scatter-chart-yaxis")
      .call(d3.axisLeft(yAxis));

    // Add dots
    svg.append("g").attr("class", "scatter-chart-points");
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

  // Update the chart when with new data.
  const updateChart = React.useCallback(
    (data: number[][]) => {
      // Get the current SVG of the chart
      const svg = currentChart();

      // Update the x-axis
      const xAxis = xScale.domain([0, d3.max(data, (d) => d[0]) as number]);
      // NOTE: This is a shorthand to update the axis without using .call
      //       (using .call had type issues with .select).
      d3.axisBottom(xAxis)(svg.select("g.scatter-chart-xaxis"));

      // Update the y-axis
      const yAxis = yScale.domain([0, d3.max(data, (d) => d[1]) as number]);
      d3.axisLeft(yAxis)(svg.select("g.scatter-chart-yaxis"));

      // Remove the old points
      svg.selectAll("circle").remove();

      // Append the new points
      svg
        .select("g.scatter-chart-points")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d[0]) as number)
        .attr("cy", (d) => yScale(d[1]) as number)
        .attr("r", 3)
        .style("fill", "blue");
    },
    [currentChart, xScale, yScale]
  );

  // Build or update chart when data changes
  React.useEffect(() => {
    // Convert from the GenerationData/Array to the exact array type (number[][])
    const data: number[][] = props.data ? (props.data.data as number[][]) : [];
    console.log("Render: ", data);

    // Build chart initially otherwise update for data
    if (!builtChart) {
      buildChart();
      setBuiltChart(true);
    } else {
      updateChart(data);
    }
  }, [buildChart, builtChart, props.data, updateChart]);

  return (
    <div id="chartContainer">
      <svg ref={chartRef}></svg>
    </div>
  );
};

const mapStateToProps = (state: StateType): VCProps => {
  return {
    data: state.frontend.data,
  };
};

export default connect(mapStateToProps)(VisualisationComponent);
