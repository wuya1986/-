import * as ACTION from '../constants/ecard';

const INITIAL_STATE = {
  result: null,
  loading: false,
  error: false,
  just_recharged: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION.ECARD_RECHARGE:
      return {
        ...state,
        just_recharged: true,
      };
    case ACTION.ECARD_RESET_RECHARGE:
      return {
        ...state,
        just_recharged: false,
      };
    default:
      return state;
  }
}
