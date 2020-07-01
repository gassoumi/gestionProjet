import { CREATE_MESSAGE, GET_ERRORS } from '../actionTypes';

//create message
export const createMessage = msg => {
    return {
        type: CREATE_MESSAGE,
        payload: msg
    };
};

// return errors
export const returnErrors = (msg, status)  => {
    return {
        type: GET_ERRORS,
        payload: { msg, status }
    }
};