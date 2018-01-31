import { combineReducers } from 'redux';

import auth from './auth';
import ecard from './ecard';
import nav from './nav';
import tickets from './tickets';
import parking_info from './parking_info';
import pay from './pay';

const rootReducer = combineReducers({
  auth,
  ecard,
  nav,
  tickets,
  parking_info,
  pay,
});

export default rootReducer;
