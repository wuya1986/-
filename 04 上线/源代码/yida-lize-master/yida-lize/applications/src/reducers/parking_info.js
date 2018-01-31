import * as ACTION from '../constants/parking_info';

const INITIAL_STATE = {
  parking_info: null,
  error: null,
  loading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.QUERY_PARKING_INFO_REQUEST:
      return {
        ...state,
        parking_info: null,
        error: null,
        loading: true,
      };
    case ACTION.QUERY_PARKING_INFO_SUCCESS:
      return {
        ...state,
        parking_info: action.res.parking_info.data,
        error: null,
        loading: false,
      };
    case ACTION.QUERY_PARKING_INFO_FAILURE:
      return {
        ...state,
        parking_info: null,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
