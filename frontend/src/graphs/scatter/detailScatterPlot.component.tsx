import * as d3 from 'd3';
import React from 'react';
import { initiateSocket, subscribeToData } from '../../Socket';

// TODO: Connect to a state.

interface ScatterPlotState {
    chartConnected: boolean;
    data: number[][];
}

const sampleData = [
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
];

class DetailScatterPlot extends React.Component<unknown, ScatterPlotState> {
    chartRef: React.RefObject<SVGSVGElement>;
    // chartSvg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>;

    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    width: number;
    height: number;

    xScale: d3.ScaleLinear<number, number>;
    yScale: d3.ScaleLinear<number, number>;

    public constructor(props: ScatterPlotState) {
        super(props);

        // Create ref and configure D3 selection for svg chart.
        this.chartRef = React.createRef<SVGSVGElement>();

        // Initialise the chart sizes
        this.margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 60,
        };
        this.width = 760 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;

        // Add scales
        this.xScale = d3.scaleLinear().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);

        this.state = {
            chartConnected: false,
            data: sampleData,
        };
    }

    currentChart = (): d3.Selection<SVGSVGElement | null, unknown, null, undefined> => d3.select(this.chartRef.current);

    public componentDidMount(): void {
        this.buildChart();

        if (!this.state.chartConnected) {
            //  Start socket connections.
            initiateSocket();

            // Subscribe to the data feed.
            subscribeToData((data) => {
                this.setState({ data: [...this.state.data, [data.x, data.y]] });
            });

            // Set to being connected.
            this.setState({ chartConnected: true });
        }
    }

    public componentDidUpdate(prevProps: unknown, prevState: ScatterPlotState): void {
        console.log('Previous: ', prevState.data);
        console.log('New: ', this.state.data);

        this.updateChart();
    }

    // Build the chart initially.
    private buildChart(): void {
        // Adjust the svg.
        const svg = this.currentChart()
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Add x axis
        const xAxis = this.xScale.domain([0, d3.max(this.state.data, (d) => d[0]) as number]);
        svg.append('g')
            .attr('class', 'scatter-chart-xaxis')
            .attr('transform', `translate(0, ${this.height})`)
            .call(d3.axisBottom(xAxis));

        // Add y axis
        const yAxis = this.yScale.domain([0, d3.max(this.state.data, (d) => d[1]) as number]);
        svg.append('g').attr('class', 'scatter-chart-yaxis').call(d3.axisLeft(yAxis));

        // Add dots
        svg.append('g')
            .attr('class', 'scatter-chart-points')
            .selectAll('dot')
            .data(this.state.data)
            .enter()
            .append('circle')
            .attr('cx', (d) => d[0])
            .attr('cy', (d) => d[1])
            .attr('r', 3)
            .style('fill', '#69b3a2');
    }

    // Update the chart when with new data.
    private updateChart(): void {
        // Get the current SVG of the chart
        const svg = this.currentChart();

        // Update the x-axis
        const xAxis = this.xScale.domain([0, d3.max(this.state.data, (d) => d[0]) as number]);
        // NOTE: This is a shorthand to update the axis without using .call
        //       (using .call had type issues with .select).
        d3.axisBottom(xAxis)(svg.select('g.scatter-chart-xaxis'));

        // Update the y-axis
        const yAxis = this.yScale.domain([0, d3.max(this.state.data, (d) => d[1]) as number]);
        d3.axisLeft(yAxis)(svg.select('g.scatter-chart-yaxis'));

        // Update points
        svg.select('g.scatter-chart-points')
            .selectAll('dot')
            .data(this.state.data)
            .enter()
            .append('circle')
            .attr('cx', (d) => d[0])
            .attr('cy', (d) => d[1])
            .attr('r', 3)
            .style('fill', '#69b3a2');
    }

    // React.useEffect(() => {
    //     console.log('setting up');

    //     // Read data.
    //     // d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv').then(
    //     //     (data) => {
    //     //         console.log(data);

    //     // Add dots
    //     svg.append('g')
    //         .selectAll('dot')
    //         .data(dataset)
    //         .enter()
    //         .append('circle')
    //         // .attr('cx', (d) => x(Number(d.GrLivArea)) as number)
    //         // .attr('cy', (d) => y(Number(d.SalePrice)) as number)
    //         .attr('cx', (d) => d[0])
    //         .attr('cy', (d) => d[1])
    //         .attr('r', 3)
    //         .style('fill', '#69b3a2');
    //     //     },
    //     // );
    // }, [dataset]);

    public render(): React.ReactNode {
        return (
            <div id="chartContainer">
                <svg ref={this.chartRef}></svg>
            </div>
        );
    }
}

export default DetailScatterPlot;
