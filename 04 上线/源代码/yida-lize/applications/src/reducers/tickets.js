import _ from 'lodash';

import * as ACTION from '../constants/tickets';

const INITIAL_STATE = {
  tickets: [],
  error: null,
  loading: false,
  adding: false,
  added: false,
  new_ticket: null,
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
        added: false,
      };
    case ACTION.ADD_TICKET_REQUEST:
      return {
        ...state,
        error: null,
        adding: true,
        added: false,
      };
    case ACTION.ADD_TICKET_SUCCESS:
      return {
        ...state,
        tickets: _.unionBy([action.res.data], state.tickets, '_id'),
        error: null,
        adding: false,
        new_ticket: action.res.data,
        added: true,
      };
    case ACTION.ADD_TICKET_FAILURE:
      return {
        ...state,
        error: action.error,
        adding: false,
        added: false,
      };
    default:
      return state;
  }
}
