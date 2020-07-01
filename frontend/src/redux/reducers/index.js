import {combineReducers} from "redux";
import entities from "./entities";
import paginate from "./paginate";
import auth from "./auth";
import * as ActionTypes from "../actionTypes";
import messages from "./messages";
import errors from "./errors";

// Updates the pagination data for different actions.
const pagination = combineReducers({
    project: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_PROJECTS,
            ActionTypes.STARRED_SUCCESS_PROJECTS,
            ActionTypes.STARRED_FAILURE_PROJECTS,
            ActionTypes.LOGOUT_SUCCESS,
        ],
    }),
});

export default combineReducers({
    entities,
    auth,
    pagination,
    messages,
    errors
});
