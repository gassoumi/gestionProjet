import * as ActionTypes from "../actionTypes";
import {returnErrors} from "./messages";
import {LOGIN_FAIL} from "../actionTypes";
import axios from 'axios';
import {createMessage} from "./messages";
import {normalize} from "normalizr";
import {projectSchema, projectListSchema} from "../../utils";
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import {sleep} from "./sprint";

//get list of project projects
export const fetchProjects = (page = 1) => async dispatch => {
    dispatch(showLoading());
    dispatch({
        type: ActionTypes.STARRED_REQUEST_PROJECTS,
    });
    try {
        await sleep(1e2); // For demo purposes.
        const res = await axios.get(`/api/projects/?page=${page}`);
        const {data: {results, next, count}} = res;
        const normalizedData = normalize(results, projectListSchema);
        dispatch({
            type: ActionTypes.STARRED_SUCCESS_PROJECTS,
            response: normalizedData,
            nextPageUrl: next,
            page: page,
            count
        });
    } catch (e) {
        const {data, status} = e.response;
        dispatch(returnErrors(data, status));
        dispatch({
            type: ActionTypes.STARRED_FAILURE_PROJECTS,
        });
    } finally {
        dispatch(hideLoading());
    }
};

// create a project
export const createProject = (project) => dispatch => {
    dispatch(showLoading());
    axios.post('/api/projects/', project)
        .then(response => {
            const designation = response.data.designation;
            dispatch(createMessage({
                added: `le projet ${designation}  a été creé `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_PROJECT
            });
            dispatch({
                type: ActionTypes.ACTION_SUCCESS_PROJECT
            })
        })
        .catch(error => {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
            dispatch({
                type: ActionTypes.ACTION_FAILURE_PROJECT
            })
        }).finally(() => dispatch(hideLoading()))
};

// update a project
export const updateProject = (idProject, project) => dispatch => {
    dispatch(showLoading());
    axios.put(`/api/projects/${idProject}/`, project)
        .then(response => {
            const designation = response.data.designation;
            dispatch(createMessage({
                updated: `le projet ${designation} a été modifié `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_PROJECT
            });
            dispatch({
                type: ActionTypes.ACTION_SUCCESS_PROJECT
            })
        })
        .catch(error => {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
            dispatch({
                type: ActionTypes.ACTION_FAILURE_PROJECT
            })
        }).finally(() => dispatch(hideLoading()))
};

//Delete Project
export const deleteProjectById = project => (dispatch) => {
        dispatch(showLoading());
        const id = project.code_project;
        axios.delete(` /api/projects/${id}/`)
            .then(res => {
                dispatch(createMessage({
                    deleted: `le projet ${project.designation} a été supprimé`
                }));
                dispatch({
                    type: ActionTypes.CLEAR_CACHE_PROJECT
                });
                dispatch({
                    type: ActionTypes.ACTION_SUCCESS_PROJECT
                })
            })
            .catch(error => {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }).finally(() => dispatch(hideLoading()));
    }
;

//get Project
export const fetchProjectById = (id) => async dispatch => {
    dispatch(showLoading());
    try {
        const response = await axios.get(`/api/projects/${id}/`);
        const result = response.data;
        const normalizedData = normalize(result, projectSchema);
        dispatch({
            type: ActionTypes.FETCH_SUCCESS_PROJECT,
            response: normalizedData,
        });
    } catch (error) {
        const {data, status} = error.response;
        dispatch(returnErrors(data, status));
    } finally {
        dispatch(hideLoading());
    }
};


//get Project
// old one
/*
export const fetchProjectById = (id) => async dispatch => {
    dispatch(showLoading());
    try {
        const response = await axios.get(`/api/projects/${id}/`);
        const result = response.data;
        const normalizedData = normalize(result, projectSchema);
        dispatch({
            type: ActionTypes.FETCH_SUCCESS_PROJECT,
            response: normalizedData,
        });
    } catch (error) {
        const {data, status} = error.response;
        dispatch(returnErrors(data, status));
    }finally {
        dispatch(hideLoading();
    }
    axios.get(`/api/projects/${id}/`)
        .then(response => {
            const result = response.data;
            const normalizedData = normalize(result, projectSchema);
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
*/