import {hideLoading, showLoading} from "react-redux-loading-bar";
import * as ActionTypes from "../actionTypes";
import axios from "axios";
import _ from "lodash";
import {normalize} from "normalizr";
import {userSchema, usersListSchema} from "../../utils";
import {returnErrors} from "./messages";

export const fetchUsers = (page = 1, pageSize) => async (dispatch, getState) => {
    dispatch(showLoading());
    dispatch({
        type: ActionTypes.STARRED_REQUEST_USERS,
    });

    const pageSizeToUse = pageSize ||
        (getState().pagination && getState().pagination.user &&
            getState().pagination.user.pageSize) || 5;

    try {
        const res = await axios.get(`/api/auth/users/?page=${page}&page_size=${pageSizeToUse}`);
        const {data: {results, next, count}} = res;

        const normalizedData = normalize(results, usersListSchema);

        dispatch({
            type: ActionTypes.STARRED_SUCCESS_USERS,
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
            type: ActionTypes.STARRED_FAILURE_USERS,
        });
    } finally {
        dispatch(hideLoading());
    }
};

//get Project
export const fetchUserById = (id) => async dispatch => {
    dispatch(showLoading());
    try {
        const response = await axios.get(`/api/auth/users/${id}`);
        const result = response.data;
        const normalizedData = normalize(result, userSchema);
        dispatch({
            type: ActionTypes.FETCH_SUCCESS_USER,
            response: normalizedData,
        });
    } catch (error) {
        const {data, status} = error.response;
        dispatch(returnErrors(data, status));
    } finally {
        dispatch(hideLoading());
    }
};