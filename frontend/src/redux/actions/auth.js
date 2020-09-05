import axios from 'axios';
import {
    returnErrors
} from './messages';
import { toast } from "react-toastify";

import {
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    USER_LOADED,
    USER_LOADING,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    CLEAR_AUTH
} from '../actionTypes';

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}


// check token && load user
export const loadUser = () => async (dispatch, getState) => {
    dispatch({
        type: USER_LOADING
    });
    try {
        const res = await axios.get('/api/auth/user');
        await sleep(1e2);
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (error) {
        if (error.response) {
            const { data, status } = error.response;
            dispatch(returnErrors(data, status));
        }
        dispatch({
            type: AUTH_ERROR
        })
    }
};

// login user
export const login = (username, password) => async dispatch => {


    //Header
    /*
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
     */

    // Request Body
    const body = JSON.stringify({
        username,
        password
    });

    try {
        await sleep(1e2);
        const res = await axios.post('/api/auth/login', body);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
    } catch (error) {
        if (error.response) {
            const { data, status } = error.response;
            dispatch(returnErrors(data, status));
        }
        dispatch({
            type: LOGIN_FAIL
        });
    }

    // axios.post('/api/auth/login', body)
    //     .then(res => {
    //         dispatch({
    //             type: LOGIN_SUCCESS,
    //             payload: res.data
    //         });
    //     })
    //     .catch(err => {
    //         dispatch(returnErrors(err.response.data, err.response.status));
    //         dispatch({
    //             type: LOGIN_FAIL
    //         });
    //     })
};

// register user
export const register = ({ username, password, email }) => dispatch => {

    //Header
    /*
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
     */

    // Request Body
    const body = JSON.stringify({
        username,
        password,
        email
    });

    axios.post('/api/auth/register', body)
        .then(res => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        })
        .catch(error => {
            if (error.response) {
                const { data, status } = error.response;
                dispatch(returnErrors(data, status));
            }
            dispatch({
                type: REGISTER_FAIL
            })
        })
};

// logout user
export const logout = () => (dispatch, getState) => {

    axios.post('/api/auth/logout', null)
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        })
        .catch(error => {
            if (error.response) {
                const { data, status } = error.response;
                dispatch(returnErrors(data, status));
            }
        })
};

// setup config with token -helper function
export const tokenConfig = getState => {
    // get token from state
    const token = getState().auth.token;

    //Header
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    // if token add to header config
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
};

export const clearAuthToken = () => {
    if (Storage.local.get("token")) {
        Storage.local.remove("token");
    }
    if (Storage.session.get("token")) {
        Storage.session.remove("token");
    }
};

export const clearAuthentication = (messageKey) => (dispatch, getState) => {
    //clearAuthToken();
    //dispatch(displayAuthError(messageKey));
    console.log("clearAuthentication is called ", messageKey);
    return dispatch({
        type: LOGOUT_SUCCESS,
    });
};

