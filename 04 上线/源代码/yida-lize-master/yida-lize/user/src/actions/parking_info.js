import { CALL_API } from '../middleware/api';

import * as ACTION from '../constants/parking_info';


export const queryParkingInfo = () => ({
  [CALL_API]: {
    endpoint: '/parking/query',
    init: {
      method: 'GET',
    },
    types: [
      ACTION.QUERY_PARKING_INFO_REQUEST,
      ACTION.QUERY_PARKING_INFO_SUCCESS,
      ACTION.QUERY_PARKING_INFO_FAILURE,
    ],
  },
});

export const queryParkingMyHistory = () => ({
  [CALL_API]: {
    endpoint: '/parking/getauth',
    init: {
      method: 'GET',
    },
    types: [
      ACTION.QUERY_PARKING_MY_HISTORY_REQUEST,
      ACTION.QUERY_PARKING_MY_HISTORY_SUCCESS,
      ACTION.QUERY_PARKING_MY_HISTORY_FAILURE,
    ],
  },
});

export const modifyParkingAuth = info => ({
  [CALL_API]: {
    endpoint: '/parking/modify_auth',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.MODIFY_PARKING_AUTH_REQUEST,
      ACTION.MODIFY_PARKING_AUTH_SUCCESS,
      ACTION.MODIFY_PARKING_AUTH_FAILURE,
    ],
  },
});
