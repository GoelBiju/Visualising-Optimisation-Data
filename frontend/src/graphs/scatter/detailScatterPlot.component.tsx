import * as d3 from 'd3';
import React from 'react';

const DetailScatterPlot = (): React.ReactElement => {
    // const [dataset] = React.useState<number[][]>([
    //     [34, 78],
    //     [109, 280],
    //     [310, 120],
    //     [79, 411],
    //     [420, 220],
    //     [233, 145],
    //     [333, 96],
    //     [222, 333],
    //     [78, 320],
    //     [21, 123],
    // ]);
    // const [width] = React.useState<number>(600);
    // const [height] = React.useState<number>(500);
    // const [padding] = React.useState<number>(70);

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

        // Set up the scales.
        // const xScale = d3
        //     .scaleLinear()
        //     .domain([0, d3.max(dataset, (d) => d[0]) as number])
        //     .range([padding, width - padding]);
        // const yScale = d3
        //     .scaleLinear()
        //     .domain([0, d3.max(dataset, (d) => d[1]) as number])
        //     .range([height - padding, padding]);

        // // Add circles.
        // svg.selectAll('circle')
        //     .data(dataset)
        //     .enter()
        //     .append('circle')
        //     .attr('cx', (d) => xScale(d[0]) as number)
        //     .attr('cy', (d) => yScale(d[1]) as number)
        //     .attr('r', 5);

        // // Add labels.
        // svg.selectAll('text')
        //     .data(dataset)
        //     .enter()
        //     .append('text')
        //     .text((d) => d[0] + ',' + d[1])
        //     .attr('x', (d) => xScale(d[0] + 10) as number)
        //     .attr('y', (d) => yScale(d[1]) as number);

        // // Create x and y axis.
        // const xAxis = d3.axisBottom(xScale);
        // const yAxis = d3.axisLeft(yScale);

        // // Add x-axis to svg.
        // svg.append('g')
        //     .attr('transform', 'translate(0, ' + (height - padding) + ')')
        //     .call(xAxis);

        // // Add y-axis to svg.
        // svg.append('g')
        //     .attr('transform', 'translate(' + padding + ', 0)')
        //     .call(yAxis);

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
