import React from 'react';
import './App.css';
import BarChart from './graphs/bar/barChart.component';
import DetailBarChart from './graphs/bar/detailBarChart.component';
import DetailScatterPlot from './graphs/scatter/detailScatterPlot.component';
import ScatterPlot from './graphs/scatter/scatterPlot.component';

function App() {
    return (
        <div className="App">
            <p>Visualising Optimisation Data</p>
            <BarChart />
            <ScatterPlot />
            <DetailScatterPlot />
            <DetailBarChart />
        </div>
    );
}

export default App;
