import union from "lodash/union";

// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
const paginate = ({types}) => {
    if (!Array.isArray(types) || types.length !== 5) {
        throw new Error("Expected types to be an array of three elements.");
    }
    if (!types.every((t) => typeof t === "string")) {
        throw new Error("Expected types to be strings.");
    }


    const [requestType, successType,
        failureType, logout, clearCacheType] = types;

    // updateSuccess for manage create or update or delete
    // only one action at the same time so we use the same variable for all those action
    const initialState = {
        isFetching: false,
        nextPageUrl: null,
        page: 1,
        ids: [],
        pageIds: [],
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
                };
            case successType:
                return {
                    ...state,
                    isFetching: false,
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
            case clearCacheType:
                return {
                    ...initialState,
                    pageSize: state.pageSize,
                };
            case logout:
                return initialState;
            default:
                return state;
        }
    };
};

export default paginate;
