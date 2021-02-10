import React from 'react';
import MainAppBar from './components/mainAppBar.component';
import Routing from './components/routing.component';
import './stylesheets/App.css';

function App() {
    return (
        <div className="App">
            <MainAppBar />
            <Routing />
        </div>
    );
}

export default App;
