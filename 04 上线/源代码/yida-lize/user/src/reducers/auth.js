import { AsyncStorage } from 'react-native';
import AliyunPush from 'react-native-aliyun-push';

import * as ACTION from '../constants/auth';
import { AVATAR_REQUEST, AVATAR_SUCCESS, AVATAR_FAILURE } from '../constants/upload';

const initialState = {
  loading: false,
  user: {
    mobile_no: '',
    memo: '',
    avatar: null,
    token: '',
    funcs: {
      news: [],
      swipers: [],
      shortcuts: [],
      applications: [],
      wallet: [],
    },
    badge: {},
    ecard: {
      balance: 0,
    },
  },
  just_requested: false,
  error: '',
};

const auth = (state = initialState, action) => {
  let user;
  switch (action.type) {
    case ACTION.SAVE_PROFILE_REQUEST:
    case ACTION.CERTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTION.SAVE_PROFILE_SUCCESS:
    case ACTION.CERTIFICATION_SUCCESS:
      user = {
        ...action.res.user,
      };

      AsyncStorage.setItem('user', JSON.stringify(user));
      return {
        ...state,
        loading: false,
        just_requested: true,
        user,
        error: '',
      };
    case ACTION.SAVE_PROFILE_FAILURE:
    case ACTION.CERTIFICATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case ACTION.LOGIN_REQUEST:
    case ACTION.TOKEN_LOGIN_REQUEST:
    case AVATAR_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTION.LOGIN_SUCCESS:
    case ACTION.TOKEN_LOGIN_SUCCESS:
      AliyunPush.setApplicationIconBadgeNumber(0);
      user = {
        ...action.res.user,
      };
      AsyncStorage.setItem('user', JSON.stringify(user));

      return {
        ...state,
        loading: false,
        user,
        error: '',
      };
    case AVATAR_SUCCESS:
      user = {
        ...state.user,
        avatar: action.res.avatar,
      };
      AsyncStorage.setItem('user', JSON.stringify(user));

      return {
        ...state,
        loading: false,
        user,
        error: '',
      };
    case ACTION.LOGIN_FAILURE:
    case ACTION.TOKEN_LOGIN_FAILURE:
    case AVATAR_FAILURE:
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
      AsyncStorage.removeItem('user');
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
    case ACTION.SEND_CODE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ACTION.SEND_CODE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ACTION.SEND_CODE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case ACTION.CERTIFICATION_RESET:
      return {
        ...state,
        just_requested: false,
      };
    case ACTION.INITIAL_USER:
      return {
        ...state,
        user: action.user,
      };
    case ACTION.BADGE_MESSAGE_RESET:
      const newState = {
        ...state,
      };
      newState.user.badge.mine.messages = action.messages;
      return newState;
    default:
      return state;
  }
};
export default auth;
