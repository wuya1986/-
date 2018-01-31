import { CALL_API } from '../middleware/api';

import * as ACTION from '../constants/messages';

export const userMessages = () => ({
  [CALL_API]: {
    endpoint: '/message/user_messages',
    init: {
      method: 'GET',
    },
    types: [
      ACTION.USER_MESSAGES_REQUEST,
      ACTION.USER_MESSAGES_SUCCESS,
      ACTION.USER_MESSAGES_FAILURE,
    ],
  },
});
