import { CALL_API } from '../middleware/api';
import * as ACTION from '../constants/upload';

/*
 * 上载头像
 */
export const avatar = info => ({
  [CALL_API]: {
    endpoint: '/staff-upload/avatar',
    init: {
      method: 'POST',
      body: JSON.stringify(info),
    },
    types: [
      ACTION.AVATAR_REQUEST,
      ACTION.AVATAR_SUCCESS,
      ACTION.AVATAR_FAILURE,
    ],
  },
});
