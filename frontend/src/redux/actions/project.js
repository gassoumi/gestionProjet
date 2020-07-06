import * as ActionTypes from "../actionTypes";
import {returnErrors} from "./messages";
import {LOGIN_FAIL} from "../actionTypes";
import axios from 'axios';
import {tokenConfig} from "../../utils/";
import {createMessage} from "./messages";
import {normalize} from "normalizr";
import {projectSchema, projectListSchema} from "../../utils/";
import {showLoading, hideLoading} from 'react-redux-loading-bar'


//get list of project projects
export const fetchProjects = (page = 1) => dispatch => {
    dispatch(showLoading());
    dispatch({
        type: ActionTypes.STARRED_REQUEST_PROJECTS,
    });
    axios.get(`/api/projects/?page=${page}`, tokenConfig())
        .then(res => {
            const {data: {results, next}} = res;
            const normalizedData = normalize(results, projectListSchema);
            dispatch({
                type: ActionTypes.STARRED_SUCCESS_PROJECTS,
                response: normalizedData,
                nextPageUrl: next,
                page: page
            });
        })
        .catch(err => {
            const {data, status} = err.response;
            dispatch(returnErrors(data, status));
            dispatch({
                type: ActionTypes.STARRED_FAILURE_PROJECTS,
            });
        })
        .finally(() => dispatch(hideLoading()))

};

// create a project
export const createProject = (project) => dispatch => {
    dispatch(showLoading());
    axios.post('/api/projects/', project, tokenConfig())
        .then(response => {
            dispatch(createMessage({projectAdded: 'Project added'}));
            dispatch({
                type: ActionTypes.UPDATE_SUCCESS_PROJECT
            })
        })
        .catch(error => {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
            dispatch({
                type: ActionTypes.UPDATE_FAILURE_PROJECT
            })
        }).finally(() => dispatch(hideLoading()))
};

// update a project
export const updateProject = (idProject, project) => dispatch => {
    dispatch(showLoading());
    axios.put(`/api/projects/${idProject}/`, project, tokenConfig())
        .then(response => {
            dispatch(createMessage({projectUpdated: 'Project updated'}));
            dispatch({
                type: ActionTypes.UPDATE_SUCCESS_PROJECT
            })
        })
        .catch(error => {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
            dispatch({
                type: ActionTypes.UPDATE_FAILURE_PROJECT
            })
        }).finally(() => dispatch(hideLoading()))
};

//Delete Project
export const deleteProject = id => (dispatch) => {
    dispatch(showLoading());
    axios.delete(`/api/projects/${id}/`, tokenConfig())
        .then(res => {
            dispatch(createMessage({projectDeleted: 'Project deleted'}));
        })
        .catch(error => {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
        }).finally(() => dispatch(hideLoading()));
};

//get Project
export const fetchProjectById = id => dispatch => {
    dispatch(showLoading());
    axios.get(`/api/projects/${id}`, tokenConfig())
        .then(response => {
            const result = response.data;
            const normalizedData = normalize(result, projectSchema);
            console.log(normalizedData);
            dispatch({
                type: ActionTypes.FETCH_SUCCESS_PROJECT,
                response: normalizedData,
            });
        })
        .catch(error => {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
        }).finally(() => dispatch(hideLoading()))
};