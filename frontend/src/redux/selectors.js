import * as DataTypes from './dataTypes';

const getDataState = (store, dataType) => {
    return store.entities[dataType];
};


export const getProjectsState = store => getDataState(store, DataTypes.PROJECTS);

export const getSprintsState = store => getDataState(store, DataTypes.SPRINTS);

export const getProjectUsersState = store => getDataState(store, DataTypes.PROJECTS_USERS);

export const getTasksState = store => getDataState(store, DataTypes.TASKS);

export const getUsersState = store => getDataState(store, DataTypes.USERS);

export const getDocumentsState = store => getDataState(store, DataTypes.DOCUMENTS);

export const getDiscussionsState = store => getDataState(store, DataTypes.DISCUSSIONS);

export const getCommentsState = store => getDataState(store, DataTypes.COMMENTS);


const getDataList = (store, dataType) =>
    getDataState(store, dataType) ? store.pagination[dataType].ids : [];

export const getProjectList = store => getDataList(store, DataTypes.PROJECTS);

export const getSprintList = store => getDataList(store, DataTypes.SPRINTS);

export const getTaskList = store => getDataList(store, DataTypes.TASKS);

export const getUserList = store => getDataList(store, DataTypes.USERS);

export const getDocumentList = store => getDataList(store, DataTypes.DOCUMENTS);

export const getDiscussionList = store => getDataList(store, DataTypes.DISCUSSIONS);

export const getCommentList = store => getDataList(store, DataTypes.COMMENTS);


const getDataListPage = (store, dataType) =>
    getDataState(store, dataType) ? store.pagination[dataType].pageIds : [];

export const getSprintListPage = store => getDataListPage(store, DataTypes.SPRINTS);

export const getTaskListPage = store => getDataListPage(store, DataTypes.TASKS);

export const getDocumentListPage = store => getDataListPage(store, DataTypes.DOCUMENTS);

export const getDiscussionListPage = store => getDataListPage(store, DataTypes.DISCUSSIONS);

export const getCommentListPage = store => getDataListPage(store, DataTypes.COMMENTS);


const getData = (store, dataType) => {
    switch (dataType) {
        case DataTypes.PROJECTS :
            return getProjectList(store).map(id => getProjectById(store, id));
        case DataTypes.SPRINTS:
            return getSprintList(store).map(id => getSprintById(store, id));
        case DataTypes.TASKS:
            return getTaskList(store).map(id => getTaskById(store, id));
        case DataTypes.DOCUMENTS:
            return getDocumentList(store).map(id => getDocumentById(store, id));
        case DataTypes.DISCUSSIONS:
            return getDiscussionList(store).map(id => getDiscussionById(store, id));
        case DataTypes.COMMENTS:
            return getCommentList(store).map(id => getCommentById(store, id));
        default:
            throw new Error("wrong dataType");
    }
};

export const getProjects = store =>
    getData(store, DataTypes.PROJECTS);

export const getSprints = store =>
    getData(store, DataTypes.SPRINTS);

export const getDocuments = store =>
    getData(store, DataTypes.DOCUMENTS);

export const getDiscussions = store =>
    getData(store, DataTypes.DISCUSSIONS);

export const getComments = store =>
    getData(store, DataTypes.COMMENTS);

export const getCommentsByIdDiscussion = (store, idDiscussion) => {
    let comments = [];
    const parsed = parseInt(idDiscussion);
    if (getComments(store) && parsed && !isNaN(parsed)) {
        comments = getComments(store).filter(comment => {
            return comment.discussion === parsed
        });
    }
    return comments;
};

const getDataPage = (store, dataType) => {
    switch (dataType) {
        case DataTypes.SPRINTS:
            return getSprintListPage(store).map(id => getSprintById(store, id));
        case DataTypes.TASKS:
            return getTaskListPage(store).map(id => getTaskById(store, id));
        case DataTypes.DOCUMENTS:
            return getDocumentListPage(store).map(id => getDocumentById(store, id));
        case DataTypes.DISCUSSIONS:
            return getDiscussionListPage(store).map(id => getDiscussionById(store, id));
        case DataTypes.COMMENTS:
            return getCommentListPage(store).map(id => getCommentById(store, id));
        default:
            throw new Error("wrong dataType");
    }
};


export const getSprintsPage = store =>
    getDataPage(store, DataTypes.SPRINTS);

export const getTasksPage = store =>
    getDataPage(store, DataTypes.TASKS);

export const getDocumentsPage = store =>
    getDataPage(store, DataTypes.DOCUMENTS);

export const getDiscussionsPage = store =>
    getDataPage(store, DataTypes.DISCUSSIONS);

export const getCommentsPage = store =>
    getDataPage(store, DataTypes.COMMENTS);

export const getDocumentById = (store, id) => {
    if (getDocumentsState(store)) {
        const document = {...getDocumentsState(store)[id], id};
        if (document.task) {
            return {...document, task: getTaskById(store, document.task)}
        }
        return document;
    }
    return {};
};

export const getDiscussionById = (store, id) => {
    if (getDiscussionsState(store)) {
        const discussion = {...getDiscussionsState(store)[id], id};
        if (discussion.user) {
            return {...discussion, user: getUserById(store, discussion.user)};
        }
        return discussion;
    }
    return {};
};

export const getCommentById = (store, id) => {
    if (getCommentsState(store)) {
        const comment = {...getCommentsState(store)[id], id};
        if (comment.user) {
            return {...comment, user: getUserById(store, comment.user)}
        }
        return comment;
    }
    return {};
};


export const getProjectUserById = (store, id) =>
    getProjectUsersState(store) ? {...getProjectUsersState(store)[id], id} : {};

export const getUserById = (store, id) =>
    getUsersState(store) ? {...getUsersState(store)[id], id} : {};

export const getProjectById = (store, id) => {
    if (getProjectsState(store)) {
        const project = {...getProjectsState(store)[id], id};
        let projectUsers = [];
        if (getProjectUsersState(store) && project.projectUsers) {
            projectUsers = project.projectUsers
                .map(idProjectUser => getProjectUserById(store, idProjectUser));
        }
        return {...getProjectsState(store)[id], id, projectUsers}
    }
    return {}

};

export const getSprintById = (store, id) => {
    const sprint = getSprintsState(store) ? {...getSprintsState(store)[id], id} : {};
    let projectSprint;
    if (sprint && sprint.project) {
        projectSprint = getProjectById(store, sprint.project);
    }
    return {...sprint, project: projectSprint};
};

export const getTaskById = (store, id) => {
    const task = getTasksState(store) ? {...getTasksState(store)[id], id} : {};
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
