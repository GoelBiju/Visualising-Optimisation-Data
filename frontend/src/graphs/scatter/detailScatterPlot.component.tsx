import * as d3 from 'd3';
import React from 'react';
import { initiateSocket, subscribeToData } from '../../Socket';

const DetailScatterPlot = (): React.ReactElement => {
    const margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60,
    };
    const width = 760 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const [connected, setConnected] = React.useState(false);
    const [dataset, setDataset] = React.useState<Array<Array<number>>>([
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

    // Create ref for svg chart.
    const chartRef = React.createRef<SVGSVGElement>();

    React.useEffect(() => {
        if (!connected) {
            // Start socket connections.
            initiateSocket();

            // Subscribe to the data feed.
            subscribeToData((data) => {
                setDataset((prevData) => [[data.x, data.y], ...prevData]);
            });

            // Set to being connected.
            setConnected(true);
        }
        // return () => {
        //     disconnectSocket();
        // };
    }, [connected]);

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
        // d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv').then(
        //     (data) => {
        //         console.log(data);

        // Add x axis
        const x = d3
            .scaleLinear()
            .domain([0, d3.max(dataset, (d) => d[0]) as number])
            .range([0, width]);
        svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));

        // Add y axis
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(dataset, (d) => d[1]) as number])
            .range([height, 0]);
        svg.append('g').call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
            .selectAll('dot')
            .data(dataset)
            .enter()
            .append('circle')
            // .attr('cx', (d) => x(Number(d.GrLivArea)) as number)
            // .attr('cy', (d) => y(Number(d.SalePrice)) as number)
            .attr('cx', (d) => d[0])
            .attr('cy', (d) => d[1])
            .attr('r', 3)
            .style('fill', '#69b3a2');
        //     },
        // );
    }, [chartRef]);

    return (
        <div id="chartContainer">
            <svg ref={chartRef}></svg>
        </div>
    );
};

export default DetailScatterPlot;
