import { CALL_API } from '../middleware/api';
import * as ACTION from '../constants/ecard';

/*
 * request
 */
export const request = info => ({
  [CALL_API]: {
    endpoint: '/ecard/request',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.REQUEST_REQUEST,
      ACTION.REQUEST_SUCCESS,
      ACTION.REQUEST_FAILURE,
    ],
  },
});

export const resetRequest = () => ({
  type: ACTION.REQUEST_RESET,
});
