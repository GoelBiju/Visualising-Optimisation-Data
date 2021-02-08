import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AnyAction, applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk, { ThunkDispatch } from 'redux-thunk';
import App from './App';
import { configureFrontend } from './state/actions/frontend.actions';
// import { frontendNotification } from './state/actions/frontend.actions';
import AppReducer from './state/reducers/App.reducer';
import { StateType } from './state/state.types';
import './stylesheets/index.css';

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

// setTimeout(() => {
//     store.dispatch(frontendNotification('test notifications'));
// }, 3000);

// Dispatch a call to configure the frontend
const dispatch = store.dispatch as ThunkDispatch<StateType, null, AnyAction>;
dispatch(configureFrontend());

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
);
