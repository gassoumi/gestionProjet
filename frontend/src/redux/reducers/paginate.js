import union from "lodash/union";

// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
const paginate = ({types}) => {
    if (!Array.isArray(types) || types.length !== 4) {
        throw new Error("Expected types to be an array of three elements.");
    }
    if (!types.every((t) => typeof t === "string")) {
        throw new Error("Expected types to be strings.");
    }

    const [requestType, successType, failureType, logout,] = types;

    const initialState = {
        updating: false,
        isFetching: false,
        nextPageUrl: null,
        page: 0,
        ids: [],
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
                    nextPageUrl: action.nextPageUrl,
                    page: action.page,
                };
            case failureType:
                return {
                    ...state,
                    isFetching: false,
                };
            case logout:
                return initialState;
            default:
                return state;
        }
    };
};

export default paginate;
