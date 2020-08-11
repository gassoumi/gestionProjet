import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import rootReducer from "./reducers";
import thunk from "redux-thunk";
import promiseMiddleware from 'redux-promise-middleware'
import {loadingBarMiddleware} from 'react-redux-loading-bar'

const initialState = {};

const composeEnhancers = composeWithDevTools({
    trace: true
});

const middleware = [thunk, promiseMiddleware,
    loadingBarMiddleware(),];

const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
);

/*
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);
 */

export default store;
