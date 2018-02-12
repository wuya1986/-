import * as ACTION from '../constants/contents';

const INITIAL_STATE = {
  companies: [],
  error: null,
  loading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.SEARCH_COMPANIES_REQUEST:
      return {
        ...state,
        companies: [],
        error: null,
        loading: true,
      };
    case ACTION.SEARCH_COMPANIES_SUCCESS:
      return {
        ...state,
        companies: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.SEARCH_COMPANIES_FAILURE:
      return {
        ...state,
        companies: [],
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
