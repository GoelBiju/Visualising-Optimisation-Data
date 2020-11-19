import * as d3 from 'd3';
import React from 'react';

const DetailScatterPlot = (): React.ReactElement => {
    const margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60,
    };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create ref for svg chart.
    const chartRef = React.createRef<SVGSVGElement>();

    React.useEffect(() => {
        console.log('setting up');

        // Set up the svg.
        const svg = d3
            .select(chartRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Read data.
        d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv').then(
            (data) => {
                console.log(data);

                // Add x axis
                const x = d3.scaleLinear().domain([0, 3000]).range([0, width]);
                svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));

                // Add y axis
                const y = d3.scaleLinear().domain([0, 400000]).range([height, 0]);
                svg.append('g').call(d3.axisLeft(y));

                // Add dots
                svg.append('g')
                    .selectAll('dot')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('cx', (d) => x(Number(d.GrLivArea)) as number)
                    .attr('cy', (d) => y(Number(d.SalePrice)) as number)
                    .attr('r', 1.5)
                    .style('fill', '#69b3a2');
            },
        );
    }, [chartRef]);

    return (
        <div id="chartContainer">
            <svg ref={chartRef}></svg>
        </div>
    );
};

export default DetailScatterPlot;
