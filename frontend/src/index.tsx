import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import App from './App';
import ExampleComponent from './example.component';
import './index.css';
import { frontendNotification } from './state/actions/frontend.actions';
import AppReducer from './state/reducers/App.reducer';

const middleware = [thunk];
if (process.env.NODE_ENV === 'development') {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const logger = (createLogger as any)();
    middleware.push(logger);
}

/* eslint-disable no-underscore-dangle, @typescript-eslint/no-explicit-any */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(AppReducer, composeEnhancers(applyMiddleware(...middleware)));

setTimeout(() => {
    store.dispatch(frontendNotification('test notifications'));
}, 3000);

ReactDOM.render(
    // <React.StrictMode>
    <Provider store={store}>
        <ExampleComponent />
        <App />
    </Provider>,
    // </React.StrictMode>,
    document.getElementById('root'),
);
