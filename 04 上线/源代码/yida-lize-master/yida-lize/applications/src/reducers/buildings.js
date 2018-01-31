import * as ACTION from '../constants/buildings';

const INITIAL_STATE = {
  buildings: [],
  error: null,
  loading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.FETCH_BUILDINGS_REQUEST:// start fetching buildings and set loading = true
      return {
        ...state,
        buildings: [],
        error: null,
        loading: true,
      };
    case ACTION.FETCH_BUILDINGS_SUCCESS:// return list of buildings and make loading = false
      return {
        ...state,
        buildings: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_BUILDINGS_FAILURE:// return error and make loading = false
      return {
        ...state,
        buildings: [],
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
