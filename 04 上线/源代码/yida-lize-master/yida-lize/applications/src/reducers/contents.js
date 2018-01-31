import * as ACTION from '../constants/contents';

const INITIAL_STATE = {
  contents: null,
  comment: null,
  unify: null,
  error: null,
  loading: false,
  just_saved: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.FETCH_CONTENTS_REQUEST:
      return {
        ...state,
        contents: null,
        error: null,
        loading: true,
      };
    case ACTION.FETCH_CONTENTS_SUCCESS:
      return {
        ...state,
        contents: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_CONTENTS_FAILURE:
      return {
        ...state,
        contents: null,
        error: action.error,
        loading: false,
      };
    case ACTION.CONTENTS_COMMENT_REQUEST:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case ACTION.CONTENTS_COMMENT_SUCCESS:
      return {
        ...state,
        comment: action.res.data,
        error: null,
        loading: false,
        just_saved: true,
      };
    case ACTION.CONTENTS_COMMENT_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case ACTION.CONTENTS_UNIFY_REQUEST:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case ACTION.CONTENTS_UNIFY_SUCCESS:
      return {
        ...state,
        unify: action.res.data,
        error: null,
        loading: false,
        just_saved: true,
      };
    case ACTION.CONTENTS_UNIFY_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case ACTION.RESET_CONTENTS:
      return {
        ...state,
        just_saved: false,
      };
    default:
      return state;
  }
}
