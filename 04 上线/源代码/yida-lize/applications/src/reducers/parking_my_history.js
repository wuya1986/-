import * as ACTION from '../constants/parking_info';

const INITIAL_STATE = {
  list: null,
  error: null,
  loading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.QUERY_PARKING_MY_HISTORY_REQUEST:
      return {
        ...state,
        list: null,
        error: null,
        loading: true,
      };
    case ACTION.QUERY_PARKING_MY_HISTORY_SUCCESS:
      return {
        ...state,
        list: action.res.list,
        error: null,
        loading: false,
      };
    case ACTION.QUERY_PARKING_MY_HISTORY_FAILURE:
      return {
        ...state,
        list: null,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
