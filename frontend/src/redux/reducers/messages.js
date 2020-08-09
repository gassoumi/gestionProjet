import {CREATE_MESSAGE} from "../actionTypes";

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_MESSAGE:
            return action.payload;
        default:
            return state;
    }
}