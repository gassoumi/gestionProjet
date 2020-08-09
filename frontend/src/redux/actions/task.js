import * as ActionTypes from "../actionTypes";
import {returnErrors} from "./messages";
import {LOGIN_FAIL} from "../actionTypes";
import axios from 'axios';
import {createMessage} from "./messages";
import {normalize} from "normalizr";
import {
    taskSchema,
    taskListSchema
} from "../../utils";
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import {fetchSprintById} from "./sprint";
import {fetchUserById} from "./user";
import _ from 'lodash';
import {sleep} from "./sprint";


//get list of project projects
export const fetchTasks = (page = 1, pageSize) => async (dispatch, getState) => {
    dispatch(showLoading());
    dispatch({
        type: ActionTypes.STARRED_REQUEST_TASKS,
    });

    const pageSizeToUse = pageSize ||
        (getState().pagination && getState().pagination.task &&
            getState().pagination.task.pageSize) || 5;

    try {
        await sleep(1e2); // For demo purposes.
        const res = await axios.get(`/api/tasks/?page=${page}&page_size=${pageSizeToUse}`);
        const {data: {results, next, count}} = res;
        // fetch all sprint of this list of task
        const listSprint = results.map(task => task.sprint);
        const filteredIdSprint = _.uniq(listSprint);

        // https://www.w3schools.com/js/js_loop_for.asp
        for (const idSprint of filteredIdSprint) {
            await fetchSprintById(idSprint)(dispatch);
        }

        // fetch all users of this list of tasks
        const listUser = results.map(task => task.user);
        const filteredIdUser = _.uniq(listUser);

        // https://www.w3schools.com/js/js_loop_for.asp
        for (const idUser of filteredIdUser) {
            await fetchUserById(idUser)(dispatch);
        }

        const normalizedData = normalize(results, taskListSchema);

        dispatch({
            type: ActionTypes.STARRED_SUCCESS_TASKS,
            response: normalizedData,
            nextPageUrl: next,
            page,
            pageSize: pageSizeToUse,
            count
        });
    } catch (err) {
        const {data, status} = err.response;
        dispatch(returnErrors(data, status));
        dispatch({
            type: ActionTypes.STARRED_FAILURE_TASKS,
        });
    } finally {
        dispatch(hideLoading());
    }
};

// create a task
export const createTask = (task) => (dispatch) => {
    dispatch(showLoading());
    axios.post('/api/tasks/', task)
        .then(response => {
            const description = response.data.description;
            dispatch(createMessage({
                added: `la tache ${description}  a été creée `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_TASK
            });
            dispatch({
                type: ActionTypes.ACTION_SUCCESS_TASK
            })
        })
        // .then(() => fetchSprints()(dispatch))
        .catch(error => {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
            dispatch({
                type: ActionTypes.ACTION_FAILURE_TASK
            })
        }).finally(() => dispatch(hideLoading()))
};

// update a task
export const updateTask = (idTask, task) => dispatch => {
    dispatch(showLoading());
    axios.put(`/api/tasks/${idTask}/`, task)
        .then(response => {
            const description = response.data.description;
            dispatch(createMessage({
                updated: `la tache ${description} a été modifiée `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_TASK
            });
            dispatch({
                type: ActionTypes.ACTION_SUCCESS_TASK
            })
        })
        // .then(() => fetchSprints()(dispatch))
        .catch(error => {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
            dispatch({
                type: ActionTypes.ACTION_FAILURE_TASK
            })
        }).finally(() => dispatch(hideLoading()))
};

//Delete Project
export const deleteTaskById = task => (dispatch) => {
        dispatch(showLoading());
        const id = task.id;
        axios.delete(` /api/tasks/${id}/`)
            .then(res => {
                dispatch(createMessage({
                    deleted: `la tache ${task.description} a été supprimée`
                }));
                dispatch({
                    type: ActionTypes.CLEAR_CACHE_TASK
                });
                dispatch({
                    type: ActionTypes.ACTION_SUCCESS_TASK
                })
            })
            // .then(() => fetchSprints()(dispatch))
            .catch(error => {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }).finally(() => dispatch(hideLoading()));
    }
;

//get Project
export const fetchTaskById = id => dispatch => {
    dispatch(showLoading());
    axios.get(`/api/tasks/${id}`)
        .then(response => {
            const result = response.data;
            const normalizedData = normalize(result, taskSchema);
            dispatch({
                type: ActionTypes.FETCH_SUCCESS_TASK,
                response: normalizedData,
            });
        })
        .catch(error => {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
        }).finally(() => dispatch(hideLoading()))
};

//get list of project projects
// old one
/*
export const fetchTasks =  (page = 1, pageSize) => async (dispatch, getState) => {
    dispatch(showLoading());
    dispatch({
        type: ActionTypes.STARRED_REQUEST_TASKS,
    });

    const pageSizeToUse = pageSize ||
        (getState().pagination && getState().pagination.task &&
            getState().pagination.task.pageSize) || 5;

    axios.get(`/api/tasks/?page=${page}&page_size=${pageSizeToUse}`)
        .then(res => {
            const {data: {results, next, count}} = res;
            const listSprint = results.map(task => task.sprint);
            const filteredSprint = _.uniq(listSprint);
            filteredSprint.forEach(id => {
                 fetchSprintById(id)(dispatch);
            });

            const normalizedData = normalize(results, taskListSchema);

            dispatch({
                type: ActionTypes.STARRED_SUCCESS_TASKS,
                response: normalizedData,
                nextPageUrl: next,
                page,
                pageSize: pageSizeToUse,
                count
            });
        })
        .catch(err => {
            const {data, status} = err.response;
            dispatch(returnErrors(data, status));
            dispatch({
                type: ActionTypes.STARRED_FAILURE_TASKS,
            });
        })
        .finally(() => dispatch(hideLoading()))

};
*/