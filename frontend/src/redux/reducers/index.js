import {combineReducers} from "redux";
import entities from "./entities";
import paginate from "./paginate";
import auth from "./auth";
import * as ActionTypes from "../actionTypes";
import messages from "./messages";
import errors from "./errors";
import {loadingBarReducer} from 'react-redux-loading-bar'
import entity from './entity';
import * as DataTypes from '../dataTypes';

// Updates the pagination data for different actions.
const pagination = combineReducers({
    projects: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_PROJECTS,
            ActionTypes.STARRED_SUCCESS_PROJECTS,
            ActionTypes.STARRED_FAILURE_PROJECTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.CLEAR_CACHE_PROJECT,
        ],
    }),
    sprints: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_SPRINTS,
            ActionTypes.STARRED_SUCCESS_SPRINTS,
            ActionTypes.STARRED_FAILURE_SPRINTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.CLEAR_CACHE_SPRINT,
        ],
    }),
    tasks: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_TASKS,
            ActionTypes.STARRED_SUCCESS_TASKS,
            ActionTypes.STARRED_FAILURE_TASKS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.CLEAR_CACHE_TASK,
        ],
    }),
    documents: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_DOCUMENTS,
            ActionTypes.STARRED_SUCCESS_DOCUMENTS,
            ActionTypes.STARRED_FAILURE_DOCUMENTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.CLEAR_CACHE_DOCUMENT,
        ],
    }),
    discussions: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_DISCUSSIONS,
            ActionTypes.STARRED_SUCCESS_DISCUSSIONS,
            ActionTypes.STARRED_FAILURE_DISCUSSIONS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.CLEAR_CACHE_DISCUSSION,
        ],
    }),
    comments: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_COMMENTS,
            ActionTypes.STARRED_SUCCESS_COMMENTS,
            ActionTypes.STARRED_FAILURE_COMMENTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.CLEAR_CACHE_COMMENT,
        ],
    }),
    users: paginate({
        types: [
            ActionTypes.STARRED_REQUEST_USERS,
            ActionTypes.STARRED_SUCCESS_USERS,
            ActionTypes.STARRED_FAILURE_USERS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.CLEAR_CACHE_USER,
        ],
    }),
});


const createEntity = combineReducers({
    project: entity({
        types: [
            ActionTypes.STARRED_REQUEST_PROJECTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.UPDATE_SUCCESS_PROJECT,
            ActionTypes.REMOVE_SUCCESS_PROJECT,
            ActionTypes.STARRED_FETCH_PROJECT,
            ActionTypes.FETCH_FAILURE_PROJECT,
            ActionTypes.FETCH_SUCCESS_PROJECT,
        ],
    }),
    sprint: entity({
        types: [
            ActionTypes.STARRED_REQUEST_SPRINTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.UPDATE_SUCCESS_SPRINT,
            ActionTypes.REMOVE_SUCCESS_SPRINT,
            ActionTypes.STARRED_FETCH_SPRINT,
            ActionTypes.FETCH_FAILURE_SPRINT,
            ActionTypes.FETCH_SUCCESS_SPRINT,
        ],
    }),
    task: entity({
        types: [
            ActionTypes.STARRED_REQUEST_TASKS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.UPDATE_SUCCESS_TASK,
            ActionTypes.REMOVE_SUCCESS_TASK,
            ActionTypes.STARRED_FETCH_TASK,
            ActionTypes.FETCH_FAILURE_TASK,
            ActionTypes.FETCH_SUCCESS_TASK,
        ],
    }),
    discussion: entity({
        types: [
            ActionTypes.STARRED_REQUEST_DISCUSSIONS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.UPDATE_SUCCESS_DISCUSSION,
            ActionTypes.REMOVE_SUCCESS_DISCUSSION,
            ActionTypes.STARRED_FETCH_DISCUSSION,
            ActionTypes.FETCH_FAILURE_DISCUSSION,
            ActionTypes.FETCH_SUCCESS_DISCUSSION,
        ],
    }),
    comment: entity({
        types: [
            ActionTypes.STARRED_REQUEST_COMMENTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.UPDATE_SUCCESS_COMMENT,
            ActionTypes.REMOVE_SUCCESS_COMMENT,
            ActionTypes.STARRED_FETCH_COMMENT,
            ActionTypes.FETCH_FAILURE_COMMENT,
            ActionTypes.FETCH_SUCCESS_COMMENT,
        ],
    }),
    document: entity({
        types: [
            ActionTypes.STARRED_REQUEST_DOCUMENTS,
            ActionTypes.LOGOUT_SUCCESS,
            ActionTypes.UPDATE_SUCCESS_DOCUMENT,
            ActionTypes.REMOVE_SUCCESS_DOCUMENT,
            ActionTypes.STARRED_FETCH_DOCUMENT,
            ActionTypes.FETCH_FAILURE_DOCUMENT,
            ActionTypes.FETCH_SUCCESS_DOCUMENT,
        ],
    }),
});


export default combineReducers({
    entity: createEntity,
    entities,
    auth,
    pagination,
    messages,
    loadingBar: loadingBarReducer,
    errors
});
