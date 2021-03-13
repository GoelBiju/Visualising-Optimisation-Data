import axios from 'axios';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import 'custom-event-polyfill';
import {
    FrontendCommonReducer,
    FrontendMiddleware,
    frontendNotification,
    listenToPlugins,
    loadedSettings,
    loadUrls,
    StateType,
    ThunkResult,
} from 'frontend-common';
import { createBrowserHistory } from 'history';
import * as log from 'loglevel';
import React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AnyAction, applyMiddleware, compose, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunk, { ThunkDispatch } from 'redux-thunk';
import App from './App';
import './stylesheets/index.css';
import loadMicroFrontends from './utilities/loadMicroFrontends';

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

// Get the settings file name
console.log('Settings file: ', process.env.REACT_APP_SETTINGS);
const settingsFile = process.env.REACT_APP_SETTINGS || 'settings.json';
console.log('Settings file to load: ', settingsFile);

const configureFrontend = (store: Store<unknown, AnyAction>): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        // Request the settings file
        await axios
            .get(`/${settingsFile}`)
            .then((res) => {
                const settings = res.data;
                dispatch(frontendNotification(JSON.stringify(settings)));

                if (typeof settings !== 'object') {
                    throw Error("Configuring frontend: 'settings.json' Invalid format");
                }

                // Load URLs
                if ('backendUrl' in settings) {
                    dispatch(
                        loadUrls({
                            backendUrl: settings['backendUrl'],
                        }),
                    );
                } else {
                    throw new Error('The backendUrl is missing in setttings.json');
                }

                // Load microfrontends
                loadMicroFrontends.init(settings.plugins, store);

                // Loaded all settings
                dispatch(loadedSettings());
            })
            .catch((error) => {
                throw Error(`Frontend Error: loading settings.json: ${error.message}`);
            });
    };
};

// Dispatch a call to configure the frontend
const dispatch = store.dispatch as ThunkDispatch<StateType, null, AnyAction>;
dispatch(configureFrontend(store));

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
);
