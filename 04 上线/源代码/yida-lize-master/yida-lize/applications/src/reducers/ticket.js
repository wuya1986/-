import * as ACTION from '../constants/tickets';

const INITIAL_STATE = {
  ticket: null,
  error: null,
  loading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.FETCH_TICKET_REQUEST:// start fetching tickets and set loading = true
      return {
        ...state,
        ticket: null,
        error: null,
        loading: true,
      };
    case ACTION.FETCH_TICKET_SUCCESS:// return list of tickets and make loading = false
      return {
        ...state,
        ticket: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_TICKET_FAILURE:// return error and make loading = false
      return {
        ...state,
        ticket: null,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
