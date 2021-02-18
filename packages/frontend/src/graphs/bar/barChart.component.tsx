import * as d3 from 'd3';
import React from 'react';
import './bar.css';

const BarChart = (): React.ReactElement => {
    const [dataset] = React.useState<number[]>([12, 31, 22, 17, 25, 18, 29, 14, 9]);
    const [width] = React.useState<number>(500);
    const [height] = React.useState<number>(200);

    // Create ref for svg chart.
    const chartRef = React.createRef<SVGSVGElement>();

    React.useEffect(() => {
        console.log('setting up');

        // Set up the svg.
        const svg = d3.select(chartRef.current).attr('width', width).attr('height', height);

        // Add attributes and data to svg
        svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * 30)
            .attr('y', (d) => height - 3 * d)
            .attr('width', 25)
            .attr('height', (d) => d * 3)
            .attr('fill', 'navy')
            .attr('class', 'bar');

        // Label the data
        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text((d) => d)
            .attr('x', (d, i) => i * 30)
            .attr('y', (d) => height - (d * 3 + 3));
    }, [dataset, chartRef, width, height]);

    return (
        <div>
            <svg ref={chartRef}></svg>
        </div>
    );
};

export default BarChart;
