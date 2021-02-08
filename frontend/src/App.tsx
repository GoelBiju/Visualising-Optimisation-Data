import React from 'react';
import { Route, Switch } from 'react-router';
import ExampleComponent from './components/example.component';
import MainAppBar from './pages/mainAppBar.component';
import './stylesheets/App.css';

function App() {
    return (
        <div className="App">
            <MainAppBar />

            <Switch>
                <Route exact path="/one" render={() => <div>One</div>} />
                <Route exact path="/two" render={() => <div>Two</div>} />
            </Switch>

            <ExampleComponent />
        </div>
    );
}

export default App;
