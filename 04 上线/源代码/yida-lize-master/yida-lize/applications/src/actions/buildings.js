import { CALL_API } from '../middleware/api';

import * as ACTION from '../constants/buildings';

export const fetchBuildings = () => ({
  [CALL_API]: {
    endpoint: '/building',
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_BUILDINGS_REQUEST,
      ACTION.FETCH_BUILDINGS_SUCCESS,
      ACTION.FETCH_BUILDINGS_FAILURE,
    ],
  },
});
