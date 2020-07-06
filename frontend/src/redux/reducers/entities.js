import { merge } from "lodash/object";
import * as ActionTypes from "../actionTypes";

// Updates an entity cache in response to any action with response.entities.
function entities(state, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }

  return state;
}

const initialState = { projectUsers: {}, projects: {} };
//const initialState = {};
export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_SUCCESS_PROJECT:
    case ActionTypes.STARRED_SUCCESS_PROJECTS:
      return entities(state, action);
    case ActionTypes.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
