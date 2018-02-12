import * as ACTION from '../constants/ecard';

const initialState = {
  loading: false,
  data: {
  },
  error: '',
  just_requested: false,
};

const ecard = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.REQUEST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTION.REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case ACTION.REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.res.data,
        just_requested: true,
        error: '',
      };
    case ACTION.REQUEST_RESET:
      return {
        ...state,
        just_requested: false,
      };
    default:
      return state;
  }
};
export default ecard;
