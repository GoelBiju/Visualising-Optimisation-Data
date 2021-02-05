import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import './index.css';
import { frontendNotification } from './state/actions/frontend.actions';
import AppReducer from './state/reducers/App.reducer';

const history = createBrowserHistory();
const middleware = [thunk, routerMiddleware(history)];
if (process.env.NODE_ENV === 'development') {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const logger = (createLogger as any)();
    middleware.push(logger);
}

/* eslint-disable no-underscore-dangle, @typescript-eslint/no-explicit-any */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(AppReducer(history), composeEnhancers(applyMiddleware(...middleware)));

setTimeout(() => {
    store.dispatch(frontendNotification('test notifications'));
}, 3000);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            {/* <ExampleComponent />
            <App /> */}
            <Switch>
                <Route exact path="/one" render={() => <div>One</div>} />
                <Route exact path="/two" render={() => <div>Two</div>} />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
);
