import { CALL_API } from '../middleware/api';

import * as ACTION from '../constants/ecard';

export const recharge = () => ({
  type: ACTION.ECARD_RECHARGE,
});

export const resetRecharge = () => ({
  type: ACTION.ECARD_RESET_RECHARGE,
});

export const billRecord = () => ({
  [CALL_API]: {
    endpoint: '/ecard/bill_record',
    init: {
      method: 'GET',
    },
    types: [
      ACTION.BILL_RECORD_REQUEST,
      ACTION.BILL_RECORD_SUCCESS,
      ACTION.BILL_RECORD_FAILURE,
    ],
  },
});
