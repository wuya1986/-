import * as ACTION from '../constants/employees';

const INITIAL_STATE = {
  employee: null,
  error: null,
  loading: false,
  just_saved: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.FETCH_EMPLOYEE_REQUEST:
      return {
        ...state,
        employee: null,
        error: null,
        loading: true,
      };
    case ACTION.FETCH_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employee: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_EMPLOYEE_FAILURE:
      return {
        ...state,
        employee: null,
        error: action.error,
        loading: false,
      };
    case ACTION.SAVE_EMPLOYEE_REQUEST:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case ACTION.SAVE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employee: action.res.data,
        error: null,
        loading: false,
        just_saved: true,
      };
    case ACTION.SAVE_EMPLOYEE_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case ACTION.RESET_EMPLOYEE:
      return {
        ...state,
        just_saved: false,
      };
    default:
      return state;
  }
}
