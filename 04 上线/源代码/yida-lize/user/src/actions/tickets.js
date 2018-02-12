import { CALL_API } from '../middleware/api';

import * as ACTION from '../constants/tickets';

export const fetchTickets = criteria => ({
  [CALL_API]: {
    endpoint: `/ticket/user_tickets?${criteria}`,
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_TICKETS_REQUEST,
      ACTION.FETCH_TICKETS_SUCCESS,
      ACTION.FETCH_TICKETS_FAILURE,
    ],
  },
});

export const fetchTicket = _id => ({
  [CALL_API]: {
    endpoint: `/ticket/ticket/${_id}`,
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_TICKET_REQUEST,
      ACTION.FETCH_TICKET_SUCCESS,
      ACTION.FETCH_TICKET_FAILURE,
    ],
  },
});

export const resetTicket = () => ({
  type: ACTION.RESET_TICKET,
});
