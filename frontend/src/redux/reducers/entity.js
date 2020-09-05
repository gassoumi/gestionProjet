const entity = ({types}) => {

    const [requestType, logout, updateSuccessType, removeSuccessType,
        starredFetch, fetchFailure, fetchSuccess] = types;

    const initialState = {
        // for create or update an entity
        updateSuccess: false,
        // for delete an entity
        deleteSuccess: false,
        isLoaded: false,
    };

    return (state = initialState, action) => {
        switch (action.type) {
            case logout:
            case requestType:
                return initialState;
            case updateSuccessType:
                return {
                    ...state,
                    updateSuccess: true,
                };
            case starredFetch:
            case fetchFailure:
                return {
                    ...state,
                    isLoaded: false
                };
            case fetchSuccess:
                return {
                    ...state,
                    isLoaded: true,
                };
            case removeSuccessType:
                return {
                    ...state,
                    deleteSuccess: true,
                };
            default :
                return state;
        }
    }

};

export default entity;