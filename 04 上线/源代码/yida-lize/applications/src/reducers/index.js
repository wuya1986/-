import { combineReducers } from 'redux';

import auth from './auth';
import buildings from './buildings';
import ecard_recharge from './ecard_recharge';
import ecard_bill_record from './ecard_bill_record';
import employee from './employee';
import employees from './employees';
import messages from './messages';
import contents from './contents';
import contents_list from './contents_list';
import companies from './companies';
import parking_info from './parking_info';
import parking_my_history from './parking_my_history';
import ticket from './ticket';
import ticket_template from './ticket_template';
import tickets from './tickets';
import meter from './meter';

const rootReducer = combineReducers({
  auth,
  buildings,
  ecard_recharge,
  ecard_bill_record,
  employee,
  employees,
  messages,
  contents,
  contents_list,
  companies,
  parking_info,
  parking_my_history,
  ticket,
  ticket_template,
  tickets,
  meter,
});

export default rootReducer;
