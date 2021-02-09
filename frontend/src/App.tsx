import React from 'react';
// import ExampleComponent from './components/example.component';
import MainAppBar from './components/mainAppBar.component';
import Routing from './components/routing.component';
import './stylesheets/App.css';

function App() {
    return (
        <div className="App">
            <MainAppBar />
            <Routing />
            {/* <ExampleComponent /> */}
        </div>
    );
}

export default App;
