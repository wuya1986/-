import * as ACTION from '../constants/parking_info';

const INITIAL_STATE = {
  parking_info: null,
  error: null,
  loading: false,
  recharged: false,
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
    case ACTION.MODIFY_PARKING_AUTH_REQUEST:
      return {
        ...state,
        error: null,
        loading: true,
        recharged: false,
      };
    case ACTION.MODIFY_PARKING_AUTH_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        recharged: true,
      };
    case ACTION.MODIFY_PARKING_AUTH_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
        recharged: false,
      };
    default:
      return state;
  }
}
