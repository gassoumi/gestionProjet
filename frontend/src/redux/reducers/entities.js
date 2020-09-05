import {merge} from "lodash/object";
import * as ActionTypes from "../actionTypes";

// Updates an entity cache in response to any action with response.entities.
function entities(state, action) {
    if (action.response && action.response.entities) {
        return merge({}, state, action.response.entities);
    }

    return state;
}

const initialState = {
    projectUsers: {}, projects: {}, sprints: {}, tasks: {}, users: {}, documents: {},
    discussions: {}, comments: {},
};
//const initialState = {};
export default function (state = initialState, action) {
    switch (action.type) {
        case ActionTypes.STARRED_SUCCESS_PROJECTS:
        case ActionTypes.STARRED_SUCCESS_SPRINTS:
        case ActionTypes.STARRED_SUCCESS_TASKS:
        case ActionTypes.STARRED_SUCCESS_USERS:
        case ActionTypes.STARRED_SUCCESS_DOCUMENTS:
        case ActionTypes.STARRED_SUCCESS_DISCUSSIONS:
        case ActionTypes.STARRED_SUCCESS_COMMENTS:
        case ActionTypes.FETCH_SUCCESS_PROJECT:
        case ActionTypes.FETCH_SUCCESS_SPRINT:
        case ActionTypes.FETCH_SUCCESS_TASK:
        case ActionTypes.FETCH_SUCCESS_USER:
        case ActionTypes.FETCH_SUCCESS_DOCUMENT:
        case ActionTypes.FETCH_SUCCESS_DISCUSSION:
        case ActionTypes.FETCH_SUCCESS_COMMENT:
            return entities(state, action);
        case ActionTypes.LOGOUT_SUCCESS:
            return initialState;
        case ActionTypes.CLEAR_CACHE_PROJECT:
            return {
                ...state,
                projects: {}
            };
        case ActionTypes.CLEAR_CACHE_SPRINT:
            return {
                ...state,
                sprints: {}
            };
        case ActionTypes.CLEAR_CACHE_TASK:
            return {
                ...state,
                tasks: {}
            };
        case ActionTypes.CLEAR_CACHE_USER:
            return {
                ...state,
                users: {}
            };
        case ActionTypes.CLEAR_CACHE_DOCUMENT:
            return {
                ...state,
                documents: {}
            };
        case ActionTypes.CLEAR_CACHE_DISCUSSION:
            return {
                ...state,
                discussions: {}
            };
        case ActionTypes.CLEAR_CACHE_COMMENT:
            return {
                ...state,
                comments: {}
            };
        default:
            return state;
    }
}
