import { AsyncStorage } from 'react-native';
import AliyunPush from 'react-native-aliyun-push';

import * as ACTION from '../constants/auth';
import { AVATAR_REQUEST, AVATAR_SUCCESS, AVATAR_FAILURE } from '../constants/upload';

const initialState = {
  loading: false,
  staff: {
    mobile_no: '',
    memo: '',
    avatar: null,
    token: '',
    permissions: null,
    funcs: {
      applications: [],
    },
    badge: {},
  },
  error: '',
  password_error: '',
  action: '',
  just_requested: false,
};

const auth = (state = initialState, action) => {
  let staff;
  switch (action.type) {
    case ACTION.LOGIN_REQUEST:
    case ACTION.TOKEN_LOGIN_REQUEST:
    case AVATAR_REQUEST:
    case ACTION.SAVE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTION.LOGIN_SUCCESS:
    case ACTION.TOKEN_LOGIN_SUCCESS:
    case ACTION.SAVE_PROFILE_SUCCESS:
      AliyunPush.setApplicationIconBadgeNumber(0);
      staff = {
        ...action.res.staff,
      };
      AsyncStorage.setItem('staff', JSON.stringify(staff));

      return {
        ...state,
        loading: false,
        staff,
        error: '',
      };
    case ACTION.SAVE_PROFILE_SUCCESS:
      staff = {
        ...action.res.staff,
      };
      AsyncStorage.setItem('staff', JSON.stringify(staff));

      return {
        ...state,
        loading: false,
        just_requested: true,
        staff,
        error: '',
      };
    case AVATAR_SUCCESS:
      staff = {
        ...state.staff,
        avatar: action.res.avatar,
      };
      AsyncStorage.setItem('staff', JSON.stringify(staff));

      return {
        ...state,
        loading: false,
        staff,
        error: '',
      };
    case ACTION.LOGIN_FAILURE:
    case ACTION.TOKEN_LOGIN_FAILURE:
    case AVATAR_FAILURE:
    case ACTION.SAVE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case ACTION.LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTION.LOGOUT_SUCCESS:
      AsyncStorage.removeItem('staff');
      return {
        ...initialState,
        loading: false,
        error: '',
      };
    case ACTION.LOGOUT_FAILURE:
      return {
        ...initialState,
        loading: false,
        error: action.error,
      };
    case ACTION.PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        action: ACTION.PASSWORD_REQUEST,
      };
    case ACTION.PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        action: ACTION.PASSWORD_SUCCESS,
        error: '',
      };
    case ACTION.PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        password_error: action.error,
        action: ACTION.PASSWORD_FAILURE,
      };
    case ACTION.SAVE_PROFILE_RESET:
      return {
        ...state,
        just_requested: false,
      };
    case ACTION.INITIAL_STAFF:
      return {
        ...state,
        staff: action.staff,
      };
    case ACTION.BADGE_MESSAGE_RESET:
      const newState = {
        ...state,
      };
      newState.staff.badge.mine.messages = action.messages;
      return newState;
    default:
      return state;
  }
};
export default auth;
