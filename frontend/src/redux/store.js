import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { loadingBarMiddleware } from "react-redux-loading-bar";

const initialState = {};

const middleware = [thunk, promise, loadingBarMiddleware()];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
