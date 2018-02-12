import * as ACTION from '../constants/messages';

const INITIAL_STATE = {
  messages: [],
  error: null,
  loading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.USER_MESSAGES_REQUEST:
      return {
        ...state,
        messages: [],
        error: null,
        loading: true,
      };
    case ACTION.USER_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.USER_MESSAGES_FAILURE:
      return {
        ...state,
        messages: [],
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
