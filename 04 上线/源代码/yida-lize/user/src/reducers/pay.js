import * as ACTION from '../constants/pay';

const initialState = {
  loading: false,
  payinfo: null,
  error: '',
};

const pay = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.PAY_REQUEST:
      return {
        payinfo: null,
        loading: true,
        error: null,
      };
    case ACTION.PAY_SUCCESS:
      return {
        payinfo: action.res.data,
        loading: false,
        error: null,
      };
    case ACTION.PAY_FAILURE:
      return {
        payinfo: null,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};
export default pay;
