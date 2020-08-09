import {combineReducers} from "redux";
import entities from "./entities";
import paginate from "./paginate";
import auth from "./auth";
import * as ActionTypes from "../actionTypes";
import messages from "./messages";
import errors from "./errors";
import {loadingBarReducer} from 'react-redux-loading-bar'

// Updates the pagination data for different actions.
const pagination = combineReducers({
    project: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_PROJECTS,
            ActionTypes.STARRED_SUCCESS_PROJECTS,
            ActionTypes.STARRED_FAILURE_PROJECTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.ACTION_SUCCESS_PROJECT,
            ActionTypes.ACTION_FAILURE_PROJECT,
            ActionTypes.CLEAR_CACHE_PROJECT
        ],
    }),
    sprint: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_SPRINTS,
            ActionTypes.STARRED_SUCCESS_SPRINTS,
            ActionTypes.STARRED_FAILURE_SPRINTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.ACTION_SUCCESS_SPRINT,
            ActionTypes.ACTION_FAILURE_SPRINT,
            ActionTypes.CLEAR_CACHE_SPRINT
        ],
    }),
    task: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_TASKS,
            ActionTypes.STARRED_SUCCESS_TASKS,
            ActionTypes.STARRED_FAILURE_TASKS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.ACTION_SUCCESS_TASK,
            ActionTypes.ACTION_FAILURE_TASK,
            ActionTypes.CLEAR_CACHE_TASK
        ],
    }),
     user: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_USERS,
            ActionTypes.STARRED_SUCCESS_USERS,
            ActionTypes.STARRED_FAILURE_USERS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.ACTION_SUCCESS_USER,
            ActionTypes.ACTION_FAILURE_USER,
            ActionTypes.CLEAR_CACHE_USER
        ],
    }),
});

export default combineReducers({
    entities,
    auth,
    pagination,
    messages,
    loadingBar: loadingBarReducer,
    errors
});
