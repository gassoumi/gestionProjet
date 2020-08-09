export const getProjectsState = store => store.entities.projects;

export const getSprintsState = store => store.entities.sprints;

export const getProjectUsersState = store => store.entities.projectUsers;

export const getTasksState = store => store.entities.tasks;

export const getUsersState = store => store.entities.users;

export const getProjectList = store =>
    getProjectsState(store) ? store.pagination.project.ids : [];

export const getSprintList = store =>
    getSprintsState(store) ? store.pagination.sprint.ids : [];

export const getSprintListPage = store =>
    getSprintsState(store) ? store.pagination.sprint.pageIds : [];

export const getTaskList = store =>
    getTasksState(store) ? store.pagination.task.ids : [];

export const getTaskListPage = store =>
    getTasksState(store) ? store.pagination.task.pageIds : [];

export const getUserList = store =>
    getUsersState(store) ? store.pagination.user.ids : [];

export const getProjectUserById = (store, id) =>
    getProjectUsersState(store) ? {...getProjectUsersState(store)[id], id} : null;

export const getUserById = (store, id) =>
    getUsersState(store) ? {...getUsersState(store)[id], id} : null;

export const getProjectById = (store, id) => {
    if (getProjectsState(store)) {
        const project = {...getProjectsState(store)[id], id};
        let projectUsers = [];
        if (getProjectUsersState(store) && project.projectUsers) {
            projectUsers = project.projectUsers
                .map(idProjectUser => getProjectUserById(store, idProjectUser));
        }
        return {...getProjectsState(store)[id], id, projectUsers}
    } else {
        return null
    }
};

export const getSprintById = (store, id) => {
    const sprint = getSprintsState(store) ? {...getSprintsState(store)[id], id} : null;
    let projectSprint;
    if (sprint && sprint.project) {
        projectSprint = getProjectById(store, sprint.project);
    }
    return {...sprint, project: projectSprint};
};

export const getTaskById = (store, id) => {
    const task = getTasksState(store) ? {...getTasksState(store)[id], id} : null;
    if (task == null) {
        return null
    }
    let sprint;
    if (task && task.sprint) {
        sprint = getSprintById(store, task.sprint);
    }
    let user;
    if (task && task.user) {
        user = getUserById(store, task.user)
    }
    return {...task, sprint, user};
};

export const getProjects = store =>
    getProjectList(store).map(id => getProjectById(store, id));

export const getSprints = store =>
    getSprintList(store).map(id => getSprintById(store, id));

export const getSprintsPage = store =>
    getSprintListPage(store).map(id => getSprintById(store, id));

export const getTasksPage = store =>
    getTaskListPage(store).map(id => getTaskById(store, id));

export const canEditProject = (store, username, idProject) => {
    let foundedUser = null;
    const project = getProjectById(store, idProject);
    if (getProjectUsersState(store) && username && project && project.projectUsers) {
        foundedUser = project.projectUsers
            .find(user => user.username === username && user.code_project === project.code_project);
        if (foundedUser && foundedUser.classification === 'Scrum Master') {
            return true;
        }
    }
    return false;
};
