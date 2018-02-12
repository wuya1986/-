import { CALL_API } from '../middleware/api';

import * as ACTION from '../constants/meter';

export const fetchMeters = () => ({
  [CALL_API]: {
    endpoint: '/meter/meters',
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_METERS_REQUEST,
      ACTION.FETCH_METERS_SUCCESS,
      ACTION.FETCH_METERS_FAILURE,
    ],
  },
});

export const fetchMeter = _id => ({
  [CALL_API]: {
    endpoint: `/meter/meter/${_id}`,
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_METER_REQUEST,
      ACTION.FETCH_METER_SUCCESS,
      ACTION.FETCH_METER_FAILURE,
    ],
  },
});

export const confirmMeterReading = data => ({
  [CALL_API]: {
    endpoint: '/meter/confirm_meter_reading',
    init: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    types: [
      ACTION.CONFIRM_METER_READING_REQUEST,
      ACTION.CONFIRM_METER_READING_SUCCESS,
      ACTION.CONFIRM_METER_READING_FAILURE,
    ],
  },
});
