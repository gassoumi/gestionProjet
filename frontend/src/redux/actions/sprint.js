import * as ActionTypes from "../actionTypes";
import {returnErrors} from "./messages";
import axios from 'axios';
import {createMessage} from "./messages";
import {normalize} from "normalizr";
import {sprintListSchema, sprintSchema} from "../../utils";
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import {fetchProjectById} from "./project";
import _ from 'lodash';

export function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

//get list of project projects
export const fetchSprints = (page = 1, pageSize) => async (dispatch, getState) => {
    dispatch(showLoading());
    dispatch({
        type: ActionTypes.STARRED_REQUEST_SPRINTS,
    });

    const pageSizeToUse = pageSize ||
        (getState().pagination && getState().pagination.sprints &&
            getState().pagination.sprints.pageSize) || 5;

    try {
        await sleep(1e2); // For demo purposes.
        const res = await axios.get(`/api/sprints/?page=${page}&page_size=${pageSizeToUse}`);
        const {data: {results, next, count}} = res;
        const listProject = results.map(sprint => sprint.project);
        const filteredIdProject = _.uniq(listProject);

        // https://www.w3schools.com/js/js_loop_for.asp
        for (const idProject of filteredIdProject) {
            await fetchProjectById(idProject)(dispatch);
        }

        const normalizedData = normalize(results, sprintListSchema);

        dispatch({
            type: ActionTypes.STARRED_SUCCESS_SPRINTS,
            response: normalizedData,
            nextPageUrl: next,
            page,
            pageSize: pageSizeToUse,
            count
        });
    } catch (error) {
        dispatch({
            type: ActionTypes.STARRED_FAILURE_SPRINTS,
        });
        if (error.response) {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
        }
    } finally {
        dispatch(hideLoading());
    }
};

// create a project
export const createSprint = (sprint) => (dispatch) => {
    dispatch(showLoading());
    axios.post('/api/sprints/', sprint)
        .then(response => {
            const name = response.data.name;
            dispatch(createMessage({
                added: `le sprint ${name}  a été creé `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_SPRINT
            });
            dispatch({
                type: ActionTypes.UPDATE_SUCCESS_SPRINT
            })
        })
        // .then(() => fetchSprints()(dispatch))
        .catch(error => {
            if (error.response) {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }
            // dispatch({
            //     type: ActionTypes.ACTION_FAILURE_SPRINT
            // })
        }).finally(() => dispatch(hideLoading()))
};

// update a project
export const updateSprint = (idSprint, sprint) => dispatch => {
    dispatch(showLoading());
    axios.put(`/api/sprints/${idSprint}/`, sprint)
        .then(response => {
            const name = response.data.name;
            dispatch(createMessage({
                updated: `le sprint ${name} a été modifié `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_SPRINT
            });
            dispatch({
                type: ActionTypes.UPDATE_SUCCESS_SPRINT
            })
        })
        // .then(() => fetchSprints()(dispatch))
        .catch(error => {
            if (error.response) {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }
            // dispatch({
            //     type: ActionTypes.ACTION_FAILURE_SPRINT
            // })
        }).finally(() => dispatch(hideLoading()))
};

//Delete Project
export const deleteSprintById = sprint => (dispatch) => {
        dispatch(showLoading());
        const id = sprint.id;
        axios.delete(` /api/sprints/${id}/`)
            .then(res => {
                dispatch(createMessage({
                    deleted: `le sprint ${sprint.name} a été supprimé`
                }));
                dispatch({
                    type: ActionTypes.CLEAR_CACHE_SPRINT
                });
                dispatch({
                    type: ActionTypes.REMOVE_SUCCESS_SPRINT
                })
            })
            // .then(() => fetchSprints()(dispatch))
            .catch(error => {
                if (error.response) {
                    const {data, status} = error.response;
                    dispatch(returnErrors(data, status));
                }
            }).finally(() => dispatch(hideLoading()));
    }
;

export const clearCacheSprint = () => dispatch => {
    dispatch({
        type: ActionTypes.CLEAR_CACHE_SPRINT
    });
};

//get Sprint
export const fetchSprintById = id => async dispatch => {
    dispatch(showLoading());
    try {
        const response = await axios.get(`/api/sprints/${id}/`);
        const result = response.data;
        await fetchProjectById(result.project)(dispatch);
        const normalizedData = normalize(result, sprintSchema);
        dispatch({
            type: ActionTypes.FETCH_SUCCESS_SPRINT,
            response: normalizedData,
        });
    } catch (error) {
        if (error.response) {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
        }
    } finally {
        dispatch(hideLoading());
    }
};

