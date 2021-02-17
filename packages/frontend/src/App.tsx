import React from 'react';
import MainAppBar from './components/mainAppBar.component';
import Preloader from './components/preloader.component';
import Routing from './components/routing.component';
import './stylesheets/App.css';

function App() {
    return (
        <div className="App">
            <React.Suspense fallback={<div>Finished Loading</div>}>
                <Preloader>
                    <MainAppBar />
                    <Routing />
                </Preloader>
            </React.Suspense>
        </div>
    );
}

export default App;
