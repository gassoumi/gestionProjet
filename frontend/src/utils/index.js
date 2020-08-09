import {schema, normalize} from "normalizr";


// Define a user schema
export const userSchema = new schema.Entity("users");
export const usersListSchema = new schema.Array(userSchema);

// Define a projectUsers schema
export const projectUsersSchema = new schema.Entity("projectUsers");
export const projectUsersListSchema = new schema.Array(projectUsersSchema);

// Define your projects schema
export const projectSchema = new schema.Entity(
    "projects",
    {projectUsers: projectUsersListSchema},
    {idAttribute: "code_project"}
);

export const projectListSchema = new schema.Array(projectSchema);

// Define a users schema
export const sprintSchema = new schema.Entity("sprints",
    {project: projectSchema});

export const sprintListSchema = new schema.Array(sprintSchema);

// Define a users schema
export const taskSchema = new schema.Entity("tasks",
    {sprint: sprintSchema});

export const taskListSchema = new schema.Array(taskSchema);

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
