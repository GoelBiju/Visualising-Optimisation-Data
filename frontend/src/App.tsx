import React from 'react';
import Routing from './components/routing.component';
// import ExampleComponent from './components/example.component';
import MainAppBar from './pages/mainAppBar.component';
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
