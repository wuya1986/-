import * as ACTION from '../constants/employees';

const INITIAL_STATE = {
  employees: [],
  error: null,
  loading: false,
  certificating: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.FETCH_EMPLOYEES_REQUEST:
      return {
        ...state,
        employees: [],
        error: null,
        loading: true,
      };
    case ACTION.FETCH_EMPLOYEES_SUCCESS:
      return {
        ...state,
        employees: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_EMPLOYEES_FAILURE:
      return {
        ...state,
        employees: [],
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
