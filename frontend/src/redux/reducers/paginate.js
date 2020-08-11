import union from "lodash/union";

// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
const paginate = ({types}) => {
    if (!Array.isArray(types) || types.length !== 7) {
        throw new Error("Expected types to be an array of three elements.");
    }
    if (!types.every((t) => typeof t === "string")) {
        throw new Error("Expected types to be strings.");
    }

    const [requestType, successType,
        failureType, logout, updateSuccessType, updateFailureType, clearCache] = types;

    // updateSuccess for manage create or update or delete
    // only one action at the same time so we use the same variable for all those action
    const initialState = {
        updating: false,
        isFetching: false,
        nextPageUrl: null,
        page: 1,
        ids: [],
        pageIds: [],
        updateSuccess: false,
        count: 0,
        pageSize: 10,
    };

    return (
        state = initialState,
        action
    ) => {
        switch (action.type) {
            case requestType:
                return {
                    ...state,
                    isFetching: true,
                    updateSuccess: false,
                };
            case successType:
                return {
                    ...state,
                    isFetching: false,
                    startRow: action.response.result[0],
                    ids: union(state.ids, action.response.result),
                    pageIds: action.response.result,
                    nextPageUrl: action.nextPageUrl,
                    page: action.page,
                    count: action.count,
                    pageSize: action.pageSize
                };
            case failureType:
                return {
                    ...state,
                    isFetching: false,
                };
            case updateSuccessType:
                return {
                    ...state,
                    updateSuccess: true,
                };
            case updateFailureType:
                return {
                    ...state,
                    updateSuccess: false
                };
            case logout:
                return initialState;
            case clearCache:
                return {
                    ...initialState,
                    pageSize: state.pageSize,
                };
            default:
                return state;
        }
    };
};

export default paginate;
