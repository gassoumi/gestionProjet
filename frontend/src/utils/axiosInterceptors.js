import axios from 'axios';
import {CLEAR_AUTH} from "../redux/actionTypes";

axios.defaults.headers.post['Content-Type'] = 'application/json';

// TODO ADD axios response to handle 401 status or the cache data will be displayed
const setupAxios = (dispatch, onUnauthenticated) => {
    const onRequest = config => {
        // get token from the local Storage
        const token = localStorage.getItem("token");
        // if token add to header config
        if (token) {
            config.headers["Authorization"] = `Token ${token}`;
        }
        return config;
    };
    const onResponseSuccess = response => response;
    const onResponseError = err => {
        const status = err.status || (err.response ? err.response.status : 0);
        if (status === 403 || status === 401) {
            //console.log("axios setup is called");
            //console.log(onUnauthenticated);
            onUnauthenticated();
            /*
            dispatch({
                type: CLEAR_AUTH,
            })
             */
        }
        return Promise.reject(err);
    };
    axios.interceptors.request.use(onRequest);
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxios;
