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
