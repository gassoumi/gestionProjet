export const getProjectsState = store => store.entities.projects;

export const getProjectList = store =>
    getProjectsState(store) ? store.pagination.project.ids : [];

export const getProjectById = (store, id) =>
    getProjectsState(store) ? {...getProjectsState(store)[id], id} : null;

export const getProjects = store =>
    getProjectList(store).map(id => getProjectById(store, id));

