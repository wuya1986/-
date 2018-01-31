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

export const addTicket = data => ({
  [CALL_API]: {
    endpoint: '/ticket/add_ticket',
    init: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    types: [
      ACTION.ADD_TICKET_REQUEST,
      ACTION.ADD_TICKET_SUCCESS,
      ACTION.ADD_TICKET_FAILURE,
    ],
  },
});

export const fetchTicketTemplate = id => ({
  [CALL_API]: {
    endpoint: `/ticket/ticket_template/${id}`,
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_TICKET_TEMPLATE_REQUEST,
      ACTION.FETCH_TICKET_TEMPLATE_SUCCESS,
      ACTION.FETCH_TICKET_TEMPLATE_FAILURE,
    ],
  },
});

export const fetchLastTicketByTemplate = ticket_template_id => ({
  [CALL_API]: {
    endpoint: `/ticket/user_last_ticket/${ticket_template_id}`,
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

export const addTicketComment = data => ({
  [CALL_API]: {
    endpoint: '/ticket/add_ticket_comment',
    init: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    types: [
      ACTION.ADD_TICKET_REQUEST,
      ACTION.ADD_TICKET_SUCCESS,
      ACTION.ADD_TICKET_FAILURE,
    ],
  },
});

export const addTicketClosed = data => ({
  [CALL_API]: {
    endpoint: '/ticket/add_ticket_user_closed',
    init: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    types: [
      ACTION.ADD_TICKET_REQUEST,
      ACTION.ADD_TICKET_SUCCESS,
      ACTION.ADD_TICKET_FAILURE,
    ],
  },
});

