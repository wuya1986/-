import { CALL_API } from '../middleware/api';
import * as ACTION from '../constants/auth';

export const tokenLogin = info => ({
  [CALL_API]: {
    endpoint: '/auth/login',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.TOKEN_LOGIN_REQUEST,
      ACTION.TOKEN_LOGIN_SUCCESS,
      ACTION.TOKEN_LOGIN_FAILURE,
    ],
  },
});

export const send_code = mobile_no => ({
  [CALL_API]: {
    endpoint: '/auth/send_code',
    init: {
      method: 'POST',
      body: JSON.stringify({
        mobile_no,
      }),
    },
    types: [
      ACTION.SEND_CODE_REQUEST,
      ACTION.SEND_CODE_SUCCESS,
      ACTION.SEND_CODE_FAILURE,
    ],
  },
});

export const verify_code = info => ({
  [CALL_API]: {
    endpoint: '/auth/verify_code',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.VERIFY_CODE_REQUEST,
      ACTION.VERIFY_CODE_SUCCESS,
      ACTION.VERIFY_CODE_FAILURE,
    ],
  },
});

export const certification = info => ({
  [CALL_API]: {
    endpoint: '/auth/certification',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.CERTIFICATION_REQUEST,
      ACTION.CERTIFICATION_SUCCESS,
      ACTION.CERTIFICATION_FAILURE,
    ],
  },
});

export const resetCertification = () => ({
  type: ACTION.CERTIFICATION_RESET,
});
