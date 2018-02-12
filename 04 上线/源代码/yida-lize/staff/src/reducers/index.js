import { combineReducers } from 'redux';

import auth from './auth';
import nav from './nav';

const rootReducer = combineReducers({
  nav,
  auth,
});

export default rootReducer;
