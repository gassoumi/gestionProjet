import * as Api from "../../services/api";
import * as ActionTypes from "../actionTypes";
import {returnErrors} from "./messages";
import {LOGIN_FAIL} from "../actionTypes";

export const fetchProjects = (page = 1) => (dispatch) => {
    dispatch({
        type: ActionTypes.STARRED_REQUEST_PROJECTS,
    });
    const response = Api.fetchProjects(page);
    response
        .then((data) => {
            const {response, nextPageUrl} = data;
            dispatch({
                type: ActionTypes.STARRED_SUCCESS_PROJECTS,
                response,
                nextPageUrl,
                page: data.page
            });
        })
        .catch((err) => {
                const {data, status} = err.response;
                dispatch(returnErrors(data, status));
                dispatch({
                    type: ActionTypes.STARRED_FAILURE_PROJECTS,
                });
                if (err.response.status === 401) {
                    dispatch({
                        type: LOGIN_FAIL
                    });
                }
            }
        );
};


export const clearProjectCache = () => dispatch => {

};