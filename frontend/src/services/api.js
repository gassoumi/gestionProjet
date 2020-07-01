import axios from "axios";
import {schema, normalize} from "normalizr";
import {camelizeKeys} from "humps";

// setup config with token -helper function
export const tokenConfig = () => {
    // get token from state
    const token = localStorage.getItem("token");

    //Header
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    // if token add to header config
    if (token) {
        config.headers["Authorization"] = `Token ${token}`;
    }
    return config;
};

export const BASE_API = "/api/";

// Fetches an API response and normalizes the result JSON according to schema.
const callApi = async (endpoint, schema, page = 1) => {
    const fullUrl =
        endpoint.indexOf(BASE_API) === -1 ? BASE_API + endpoint : endpoint;

    try {
        const res = await axios.get(fullUrl, tokenConfig());
        const {
            data: {results, next},
        } = res;
        //const results = camelizeKeys(res.data.results);
        //const results = res.data.results;
        const normalizedData = normalize(results, schema);
        return {
            response: normalizedData,
            nextPageUrl: next,
            page: page
        };
    } catch (error) {
        return Promise.reject({...error});
    }
};


// Define a users schema
const userSchema = new schema.Entity("users");
const userListSchema = new schema.Array(userSchema);

// Define your projects schema
const projectSchema = new schema.Entity(
    "projects",
    {users: userListSchema},
    {idAttribute: "code_project"}
);
const projectListSchema = new schema.Array(projectSchema);

const getProjectById = async (id) => {
    let response = await axios.get(`${BASE_API}projects/${id}`, tokenConfig());
    return response.data;
};

// api services
export const fetchUser = (login) => callApi(`users/${login}`, userSchema);
export const fetchProjects = (page) => callApi(`projects/?page=${page}`, projectListSchema, page);
export const fetchProjectById = (id) => getProjectById(id);