import * as d3 from 'd3';
import React from 'react';

const DetailBarChart = (): React.ReactElement => {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
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
        d3.csv(
            'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv',
        ).then((data) => {
            console.log('Bar chart data:', data);

            // Add x axis
            const x = d3
                .scaleBand()
                .range([0, width])
                .domain(data.map((d) => d.Country as string))
                .padding(0.2);

            svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'translate(-10, 0) rotate(-45)')
                .style('text-anchor', 'end');

            // Add y axis
            const y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
            svg.append('g').call(d3.axisLeft(y));

            // Bars
            svg.selectAll('mybar')
                .data(data)
                .enter()
                .append('rect')
                .attr('x', (d) => x(d.Country as string) as number)
                .attr('y', (d) => y(Number(d.Value)) as number)
                .attr('width', x.bandwidth())
                .attr('height', (d) => height - (y(Number(d.Value)) as number))
                .attr('fill', '#69b3a2');
        });
    }, [chartRef]);

    return (
        <div id="chartContainer">
            <svg ref={chartRef}></svg>
        </div>
    );
};

export default DetailBarChart;
