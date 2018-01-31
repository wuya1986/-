import * as ACTION from '../constants/ecard';

const INITIAL_STATE = {
  list: [],
  error: null,
  loading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.BILL_RECORD_REQUEST:
      return {
        ...state,
        list: [],
        error: null,
        loading: true,
      };
    case ACTION.BILL_RECORD_SUCCESS:
      return {
        ...state,
        list: action.res.list,
        error: null,
        loading: false,
      };
    case ACTION.BILL_RECORD_FAILURE:
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
