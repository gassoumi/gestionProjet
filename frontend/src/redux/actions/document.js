import * as ActionTypes from "../actionTypes";
import {returnErrors} from "./messages";
import axios from 'axios';
import {createMessage} from "./messages";
import {normalize} from "normalizr";
import {documentsListSchema} from "../../utils";
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import {sleep} from "./sprint";
import {fetchTaskById} from "./task";
import _ from "lodash";


// https://stackoverflow.com/questions/41878838/how-do-i-set-multipart-in-axios-with-react
// create a document
export const createDocument = (formData) => dispatch => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    dispatch(showLoading());
    axios.post('/api/documents/', formData, config)
        .then(response => {
            const description = response.data.description;
            dispatch(createMessage({
                added: `Le document ${description}  a été ajouté `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_DOCUMENT
            });
            dispatch({
                type: ActionTypes.UPDATE_SUCCESS_DOCUMENT
            })
        })
        .catch(error => {
            if (error.response) {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }
            // dispatch({
            //     type: ActionTypes.ACTION_FAILURE_DOCUMENT
            // })
        }).finally(() => dispatch(hideLoading()))
};

export const clearCacheDocument = () => dispatch => {
    dispatch({
        type: ActionTypes.CLEAR_CACHE_DOCUMENT
    });
};

//Delete document
// TODO delete api from backend
export const deleteDocumentById = document => (dispatch) => {
        dispatch(showLoading());
        const id = document.id;
        axios.delete(` /api/documents/${id}/`)
            .then(res => {
                dispatch(createMessage({
                    deleted: `le document ${document.description} a été supprimée`
                }));
                dispatch({
                    type: ActionTypes.CLEAR_CACHE_DOCUMENT
                });
                dispatch({
                    type: ActionTypes.REMOVE_SUCCESS_DOCUMENT
                })
            })
            .catch(error => {
                if (error.response) {
                    const {data, status} = error.response;
                    dispatch(returnErrors(data, status));
                }
            }).finally(() => dispatch(hideLoading()));
    }
;

// update a document
export const updateDocument = (id, formData) => async dispatch => {
    dispatch(showLoading());
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    const isMoveToExpired = formData.get('state') != null;
    axios.patch(`/api/documents/${id}/`, formData, config)
        .then(response => {
            const description = response.data.description;
            const message = isMoveToExpired ? "déplacé à la liste des documents à périmés" :
                "modifié";
            dispatch(createMessage({
                updated: `le document ${description} a été ${message} `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_DOCUMENT
            });
            dispatch({
                type: ActionTypes.UPDATE_SUCCESS_DOCUMENT
            })
        })
        .catch(error => {
            if (error.response) {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }
            // dispatch({
            //     type: ActionTypes.ACTION_FAILURE_DOCUMENT
            // })
        }).finally(() => dispatch(hideLoading()))
};

//get list of documents
export const fetchDocuments = (page = 1, pageSize, queryString = "") => async (dispatch, getState) => {
    dispatch(showLoading());
    dispatch({
        type: ActionTypes.STARRED_REQUEST_DOCUMENTS,
    });

    const pageSizeToUse = pageSize ||
        (getState().pagination && getState().pagination.documents &&
            getState().pagination.documents.pageSize) || 5;

    try {
        await sleep(1e2); // For demo purposes.
        const res = await axios
            .get(`/api/documents/?page=${page}&page_size=${pageSizeToUse}&${queryString}`);
        const {data: {results, next, count}} = res;
        // fetch all tasks of this list of documents
        const listTask = results.map(document => document.task).filter(item => item != null);
        const filteredIdTask = _.uniq(listTask);

        // https://www.w3schools.com/js/js_loop_for.asp
        for (const idTask of filteredIdTask) {
            await fetchTaskById(idTask)(dispatch);
        }

        const normalizedData = normalize(results, documentsListSchema);

        dispatch({
            type: ActionTypes.STARRED_SUCCESS_DOCUMENTS,
            response: normalizedData,
            nextPageUrl: next,
            page,
            pageSize: pageSizeToUse,
            count
        });
    } catch (error) {
        dispatch({
            type: ActionTypes.STARRED_FAILURE_DOCUMENTS,
        });
        if (error.response) {
            const {data, status} = error.response;
            dispatch(returnErrors(data, status));
        }
    } finally {
        dispatch(hideLoading());
    }
};