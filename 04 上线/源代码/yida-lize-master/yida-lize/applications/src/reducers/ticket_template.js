import * as ACTION from '../constants/tickets';

const INITIAL_STATE = {
  ticket_template: {},
  error: null,
  loading: false,
  adding: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.FETCH_TICKET_TEMPLATE_REQUEST:
      return {
        ...state,
        ticket_template: {},
        error: null,
        loading: true,
      };
    case ACTION.FETCH_TICKET_TEMPLATE_SUCCESS:
      return {
        ...state,
        ticket_template: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_TICKET_TEMPLATE_FAILURE:
      return {
        ...state,
        ticket_template: {},
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
