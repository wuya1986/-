import * as ACTION from '../constants/contents';

const INITIAL_STATE = {
  list: [],
  error: null,
  loading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.FETCH_CONTENTS_BY_PATH_REQUEST:
      return {
        ...state,
        list: [],
        error: null,
        loading: true,
      };
    case ACTION.FETCH_CONTENTS_BY_PATH_SUCCESS:
      return {
        ...state,
        list: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_CONTENTS_BY_PATH_FAILURE:
      return {
        ...state,
        list: [],
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
