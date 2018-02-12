import _ from 'lodash';

import * as ACTION from '../constants/meter';

const INITIAL_STATE = {
  meters: [],
  meter: null,
  error: null,
  loading: false,
  confirming: false,
  confirmed: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.FETCH_METERS_REQUEST:
      return {
        ...state,
        meters: [],
        error: null,
        loading: true,
      };
    case ACTION.FETCH_METERS_SUCCESS:
      return {
        ...state,
        meters: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_METERS_FAILURE:
      return {
        ...state,
        meters: [],
        error: action.error,
        loading: false,
      };
    case ACTION.FETCH_METER_REQUEST:
      return {
        ...state,
        meter: null,
        error: null,
        loading: true,
      };
    case ACTION.FETCH_METER_SUCCESS:
      return {
        ...state,
        meter: action.res.data,
        error: null,
        loading: false,
      };
    case ACTION.FETCH_METER_FAILURE:
      return {
        ...state,
        meter: null,
        error: action.error,
        loading: false,
      };
    case ACTION.CONFIRM_METER_READING_REQUEST:
      return {
        ...state,
        error: null,
        confirming: true,
        confirmed: false,
      };
    case ACTION.CONFIRM_METER_READING_SUCCESS:
      return {
        ...state,
        error: null,
        meter: action.res.data,
        confirming: false,
        confirmed: true,
      };
    case ACTION.CONFIRM_METER_READING_FAILURE:
      return {
        ...state,
        error: action.error,
        confirming: false,
        confirmed: false,
      };
    default:
      return state;
  }
}
