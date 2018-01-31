import { CALL_API } from '../middleware/api';

import * as ACTION from '../constants/contents';


export const fetchContentsByAlias = alias => ({
  [CALL_API]: {
    endpoint: `/cms-contents/alias/${alias}`,
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_CONTENTS_REQUEST,
      ACTION.FETCH_CONTENTS_SUCCESS,
      ACTION.FETCH_CONTENTS_FAILURE,
    ],
  },
});

export const listContentsByPath = path => ({
  [CALL_API]: {
    endpoint: `/cms-contents/path/${path}`,
    init: {
      method: 'GET',
    },
    types: [
      ACTION.FETCH_CONTENTS_BY_PATH_REQUEST,
      ACTION.FETCH_CONTENTS_BY_PATH_SUCCESS,
      ACTION.FETCH_CONTENTS_BY_PATH_FAILURE,
    ],
  },
});

export const searchCompanyByKeyword = keyword => ({
  [CALL_API]: {
    endpoint: `/cms-contents/company/${keyword}`,
    init: {
      method: 'GET',
    },
    types: [
      ACTION.SEARCH_COMPANIES_REQUEST,
      ACTION.SEARCH_COMPANIES_SUCCESS,
      ACTION.SEARCH_COMPANIES_FAILURE,
    ],
  },
});

export const comment = (alias, data) => ({
  [CALL_API]: {
    endpoint: `/cms-contents/comment/${alias}`,
    init: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    types: [
      ACTION.CONTENTS_COMMENT_REQUEST,
      ACTION.CONTENTS_COMMENT_SUCCESS,
      ACTION.CONTENTS_COMMENT_FAILURE,
    ],
  },
});

export const unify = (alias, data) => ({
  [CALL_API]: {
    endpoint: `/cms-contents/unify/${alias}`,
    init: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    types: [
      ACTION.CONTENTS_UNIFY_REQUEST,
      ACTION.CONTENTS_UNIFY_SUCCESS,
      ACTION.CONTENTS_UNIFY_FAILURE,
    ],
  },
});

export const reset = () => ({
  type: ACTION.RESET_CONTENTS,
});
