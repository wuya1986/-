import * as ACTION from '../constants/tickets';

const INITIAL_STATE = {
  tickets: [],
  error: null,
  loading: false,
  adding: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.FETCH_TICKETS_REQUEST:// start fetching tickets and set loading = true
      return {
        ...state,
        tickets: [],
        error: null,
        loading: true,
      };
    case ACTION.FETCH_TICKETS_SUCCESS:// return list of tickets and make loading = false
      return {
        ...state,
        tickets: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_TICKETS_FAILURE:// return error and make loading = false
      return {
        ...state,
        tickets: [],
        error: action.error,
        loading: false,
      };
    case ACTION.RESET_TICKET:
      return {
        ...state,
        error: null,
        adding: false,
      };
    default:
      return state;
  }
}
