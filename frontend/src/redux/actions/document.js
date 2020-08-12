import * as ActionTypes from "../actionTypes";
import {returnErrors} from "./messages";
import {LOGIN_FAIL} from "../actionTypes";
import axios from 'axios';
import {createMessage} from "./messages";
import {normalize} from "normalizr";
import {projectSchema, projectListSchema} from "../../utils";
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import {sleep} from "./sprint";

// create a project
export const createDocument = (document) => dispatch => {
    dispatch(showLoading());
    axios.post('/api/documents/', document)
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