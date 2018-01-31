import { CALL_API } from '../middleware/api';
import * as ACTION from '../constants/auth';

export const profile = info => ({
  [CALL_API]: {
    endpoint: '/auth/userinfo',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.SAVE_PROFILE_REQUEST,
      ACTION.SAVE_PROFILE_SUCCESS,
      ACTION.SAVE_PROFILE_FAILURE,
    ],
  },
});

export const login = info => ({
  [CALL_API]: {
    endpoint: '/auth/login',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.LOGIN_REQUEST,
      ACTION.LOGIN_SUCCESS,
      ACTION.LOGIN_FAILURE,
    ],
  },
});

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

export const logout = () => ({
  [CALL_API]: {
    endpoint: '/auth/logout',
    init: {
      method: 'GET',
    },
    types: [
      ACTION.LOGOUT_REQUEST,
      ACTION.LOGOUT_SUCCESS,
      ACTION.LOGOUT_FAILURE,
    ],
  },
});

export const sendcode = info => ({
  [CALL_API]: {
    endpoint: '/auth/send_code',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.SEND_CODE_REQUEST,
      ACTION.SEND_CODE_SUCCESS,
      ACTION.SEND_CODE_FAILURE,
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

export const initialUser = user => ({
  type: ACTION.INITIAL_USER,
  user,
});

export const resetMessageBadge = messages => ({
  type: ACTION.BADGE_MESSAGE_RESET,
  messages,
});
