import {schema, normalize} from "normalizr";

// Define a users schema
export const projectUsersSchema = new schema.Entity("projectUsers");
export const projectUsersListSchema = new schema.Array(projectUsersSchema);

// Define your projects schema
export const projectSchema = new schema.Entity(
    "projects",
    {projectUsers: projectUsersListSchema},
    {idAttribute: "code_project"}
);

export const projectListSchema = new schema.Array(projectSchema);

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
