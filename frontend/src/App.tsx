import React from 'react';
import './App.css';
import BarChart from './graphs/bar/barChart.component';
import ScatterPlot from './graphs/scatter/scatterPlot.component';

function App() {
    return (
        <div className="App">
            <p>Visualising Optimisation Data</p>
            <BarChart />
            <ScatterPlot />
        </div>
    );
}

export default App;
