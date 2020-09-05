import {hideLoading, showLoading} from "react-redux-loading-bar";
import * as ActionTypes from "../actionTypes";
import {sleep} from "./sprint";
import axios from "axios";
import _ from "lodash";
import {fetchUserById} from "./user";
import {normalize} from "normalizr";
import {commentsListSchema} from "../../utils";
import {returnErrors, createMessage} from "./messages";


export const fetchCommentsByDiscussion = (page = 1, pageSize, idDiscussion) =>
    async (dispatch, getState) => {
        dispatch(showLoading());
        dispatch({
            type: ActionTypes.STARRED_REQUEST_COMMENTS,
        });

        const pageSizeToUse = pageSize ||
            (getState().pagination && getState().pagination.comments &&
                getState().pagination.comments.pageSize) || 5;

        try {
            await sleep(1e3); // For demo purposes.
            const resultComment = await axios
                .get(`/api/comments/?discussion=${idDiscussion}&page=${page}&page_size=${pageSizeToUse}`);
            if (resultComment.data && resultComment.data.results) {
                const {data: {results, next, count}} = resultComment;
                const users = results.map(comment => comment.user);
                const filteredUsers = _.uniq(users);
                for (const idUser of filteredUsers) {
                    await fetchUserById(idUser)(dispatch);
                }
                const normalizedData = normalize(results, commentsListSchema);
                dispatch({
                    type: ActionTypes.STARRED_SUCCESS_COMMENTS,
                    response: normalizedData,
                    nextPageUrl: next,
                    page,
                    pageSize: pageSizeToUse,
                    count
                });
            }
        } catch (error) {
            dispatch({
                type: ActionTypes.STARRED_FAILURE_COMMENTS,
            });
            if (error.response) {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }
        } finally {
            dispatch(hideLoading());
        }
    };

export const clearCacheComment = () => dispatch => {
    dispatch({
        type: ActionTypes.CLEAR_CACHE_COMMENT
    });
};

// create a comment
export const createComment = (comment) => (dispatch, getState) => {
    dispatch(showLoading());
    // inject the user here
    const newComment = {...comment, user: getState().auth.user.id};
    axios.post('/api/comments/', newComment)
        .then(response => {
            const description = response.data.description;
            dispatch(createMessage({
                added: `le commentaire ${description}  a été creé `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_COMMENT
            });
            dispatch({
                type: ActionTypes.UPDATE_SUCCESS_COMMENT
            })
        })
        .catch(error => {
            if (error.response) {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }
        }).finally(() => dispatch(hideLoading()))
};

// update a comment
export const updateComment = (idComment, comment) => (dispatch, getState) => {
    dispatch(showLoading());
    // inject the user here
    const newComment = {...comment, user: getState().auth.user.id};
    axios.put(`/api/comments/${idComment}/`, newComment)
        .then(response => {
            const description = response.data.description;
            dispatch(createMessage({
                updated: `le commentaire ${description} a été modifié `
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_COMMENT
            });
            dispatch({
                type: ActionTypes.UPDATE_SUCCESS_COMMENT
            })
        })
        .catch(error => {
            if (error.response) {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }
        }).finally(() => dispatch(hideLoading()))
};

//Delete a comment
export const deleteCommentById = comment => (dispatch) => {
    dispatch(showLoading());
    const id = comment.id;
    axios.delete(` /api/comments/${id}/`)
        .then(res => {
            dispatch(createMessage({
                deleted: `le commentaire ${comment.description} a été supprimée`
            }));
            dispatch({
                type: ActionTypes.CLEAR_CACHE_COMMENT
            });
            dispatch({
                type: ActionTypes.REMOVE_SUCCESS_COMMENT
            })
        })
        // .then(() => fetchSprints()(dispatch))
        .catch(error => {
            if (error.response) {
                const {data, status} = error.response;
                dispatch(returnErrors(data, status));
            }
        }).finally(() => dispatch(hideLoading()));
};