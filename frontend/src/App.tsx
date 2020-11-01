import React from 'react';
import './App.css';
import ScatterGraph from './graphs/lineChart.component';

function App() {
    return (
        <div className="App">
            <p>Visualising Optimisation Data</p>
            <div>
                <ScatterGraph />
            </div>
        </div>
    );
}

export default App;
