import { CALL_API } from '../middleware/api';

import * as ACTION from '../constants/employees';

export const fetchEmployees = () => ({
  [CALL_API]: {
    endpoint: '/employee/find_in_mycompany',
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_EMPLOYEES_REQUEST,
      ACTION.FETCH_EMPLOYEES_SUCCESS,
      ACTION.FETCH_EMPLOYEES_FAILURE,
    ],
  },
});

export const fetchEmployee = _id => ({
  [CALL_API]: {
    endpoint: `/employee/employee/${_id}`,
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_EMPLOYEE_REQUEST,
      ACTION.FETCH_EMPLOYEE_SUCCESS,
      ACTION.FETCH_EMPLOYEE_FAILURE,
    ],
  },
});

export const saveEmployee = (employee_id, data) => ({
  [CALL_API]: {
    endpoint: `/employee/save/${employee_id}`,
    init: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    types: [
      ACTION.SAVE_EMPLOYEE_REQUEST,
      ACTION.SAVE_EMPLOYEE_SUCCESS,
      ACTION.SAVE_EMPLOYEE_FAILURE,
    ],
  },
});

export const resetEmployee = () => ({
  type: ACTION.RESET_EMPLOYEE,
});
