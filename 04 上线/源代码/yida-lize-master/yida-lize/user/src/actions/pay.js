import { CALL_API } from '../middleware/api';
import * as ACTION from '../constants/pay';

export const wxPay = info => ({
  [CALL_API]: {
    endpoint: '/wxpay/unified',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.PAY_REQUEST,
      ACTION.PAY_SUCCESS,
      ACTION.PAY_FAILURE,
    ],
  },
});
