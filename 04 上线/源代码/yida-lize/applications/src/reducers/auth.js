import * as ACTION from '../constants/auth';

const initialState = {
  loading: false,
  user: {
    mobile_no: null,
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
  error: '',
};

const auth = (state = initialState, action) => {
  let user;
  switch (action.type) {
    case ACTION.TOKEN_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTION.TOKEN_LOGIN_SUCCESS:
      user = {
        ...action.res.user,
      };

      return {
        ...state,
        loading: false,
        user,
      };
    case ACTION.TOKEN_LOGIN_FAILURE:
      return {
        ...initialState,
        error: action.error,
      };
    case ACTION.CERTIFICATION_RESET:
      return {
        ...state,
        just_requested: false,
      };
    case ACTION.CERTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTION.CERTIFICATION_SUCCESS:
      user = {
        ...action.res.user,
      };
      return {
        ...state,
        loading: false,
        just_requested: true,
        user,
        error: '',
      };
    case ACTION.CERTIFICATION_FAILURE:
      return {
        ...state,
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
    case ACTION.VERIFY_CODE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ACTION.VERIFY_CODE_SUCCESS:
      return {
        ...state,
        loading: false,
        bind: true,
        error: null,
      };
    case ACTION.VERIFY_CODE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};
export default auth;
