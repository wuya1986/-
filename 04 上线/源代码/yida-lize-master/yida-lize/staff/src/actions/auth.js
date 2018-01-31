import { CALL_API } from '../middleware/api';
import * as ACTION from '../constants/auth';

export const login = info => ({
  [CALL_API]: {
    endpoint: '/staff-auth/login',
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
    endpoint: '/staff-auth/login',
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

export const password = info => ({
  [CALL_API]: {
    endpoint: '/staff-auth/password',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.PASSWORD_REQUEST,
      ACTION.PASSWORD_SUCCESS,
      ACTION.PASSWORD_FAILURE,
    ],
  },
});

export const logout = () => ({
  [CALL_API]: {
    endpoint: '/staff-auth/logout',
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

export const profile = info => ({
  [CALL_API]: {
    endpoint: '/staff-auth/profile',
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

export const resetProfile = () => ({
  type: ACTION.SAVE_PROFILE_RESET,
});

export const initialStaff = staff => ({
  type: ACTION.INITIAL_STAFF,
  staff,
});

export const resetMessageBadge = messages => ({
  type: ACTION.BADGE_MESSAGE_RESET,
  messages,
});
