import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import 'custom-event-polyfill';
// import { configureFrontend } from './state/actions/frontend.actions';
// import FrontendMiddleware, { listenToPlugins } from './state/middleware/frontend.middleware';
// import AppReducer from './state/reducers/App.reducer';
// import { StateType } from './state/state.types';
import {
    configureFrontend,
    FrontendCommonReducer,
    FrontendMiddleware,
    listenToPlugins,
    StateType,
} from 'frontend-common';
import { createBrowserHistory } from 'history';
import * as log from 'loglevel';
import React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AnyAction, applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk, { ThunkDispatch } from 'redux-thunk';
import App from './App';
import './stylesheets/index.css';

// Create the middleware
const history = createBrowserHistory();
const middleware = [thunk, routerMiddleware(history), FrontendMiddleware];
if (process.env.NODE_ENV === 'development') {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const logger = (createLogger as any)();
    middleware.push(logger);
    log.setDefaultLevel(log.levels.DEBUG);
} else {
    log.setDefaultLevel(log.levels.ERROR);
}

/* eslint-disable no-underscore-dangle, @typescript-eslint/no-explicit-any */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

// Create the store
const store = createStore(FrontendCommonReducer(history), composeEnhancers(applyMiddleware(...middleware)));

// Listen to plugins
listenToPlugins(store.dispatch);

// Dispatch a call to configure the frontend
const dispatch = store.dispatch as ThunkDispatch<StateType, null, AnyAction>;
dispatch(configureFrontend(() => store));

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
);
