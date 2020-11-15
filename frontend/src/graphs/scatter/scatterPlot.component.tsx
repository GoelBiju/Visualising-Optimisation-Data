import * as d3 from 'd3';
import React from 'react';

const ScatterPlot = (): React.ReactElement => {
    const [dataset] = React.useState<number[][]>([
        [34, 78],
        [109, 280],
        [310, 120],
        [79, 411],
        [420, 220],
        [233, 145],
        [333, 96],
        [222, 333],
        [78, 320],
        [21, 123],
    ]);
    const [width] = React.useState<number>(600);
    const [height] = React.useState<number>(500);
    const [padding] = React.useState<number>(70);

    // Create ref for svg chart.
    const chartRef = React.createRef<SVGSVGElement>();

    React.useEffect(() => {
        console.log('setting up');

        // Set up the scales.
        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(dataset, (d) => d[0]) as number])
            .range([padding, width - padding]);
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(dataset, (d) => d[1]) as number])
            .range([height - padding, padding]);

        // Set up the svg.
        const svg = d3.select(chartRef.current).attr('width', width).attr('height', height);

        // Add circles.
        svg.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(d[0]) as number)
            .attr('cy', (d) => yScale(d[1]) as number)
            .attr('r', 5);

        // Add labels.
        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text((d) => d[0] + ',' + d[1])
            .attr('x', (d) => xScale(d[0] + 10) as number)
            .attr('y', (d) => yScale(d[1]) as number);

        // Create x and y axis.
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Add x-axis to svg.
        svg.append('g')
            .attr('transform', 'translate(0, ' + (height - padding) + ')')
            .call(xAxis);

        // Add y-axis to svg.
        svg.append('g')
            .attr('transform', 'translate(' + padding + ', 0)')
            .call(yAxis);
    }, [dataset, chartRef, width, height]);

    return (
        <div>
            <svg ref={chartRef}></svg>
        </div>
    );
};

export default ScatterPlot;
