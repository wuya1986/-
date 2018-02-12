import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import GuestVisit from './components/GuestVisit';
import EquipmentIo from './components/EquipmentIo';
import OfficeDecoration from './components/OfficeDecoration';
import SettleIo from './components/SettleIo';

import containers from './containers/';

import configureStore from './store/configureStore';

const store = configureStore();

render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" exact component={containers.Main} />

        <Route path="/applications/" exact component={containers.UserProfile} />
        <Route path="/applications/user-bind" component={containers.UserBind} />
        <Route path="/applications/user-certification" component={containers.UserCertification} />
        <Route path="/applications/user-parking-recharge" component={containers.UserParkingRecharge} />

        <Route path="/tickets/list/guest_visit" component={GuestVisit} />
        <Route path="/tickets/list/equipment_io" component={EquipmentIo} />
        <Route path="/tickets/list/office_decoration" component={OfficeDecoration} />
        <Route path="/tickets/list/settle_io" component={SettleIo} />

        <Route path="/tickets/new/reserve_visit" component={containers.ReserveVisitNew} />
        <Route path="/tickets/new/settle_in" component={containers.SettleIn} />
        <Route path="/tickets/new/settle_out" component={containers.SettleOut} />
        <Route path="/tickets/list/settle_in" component={containers.SettleIn} />
        <Route path="/tickets/list/settle_out" component={containers.SettleOut} />
        <Route path="/tickets/show/settle_in/:ticket_id" component={containers.SettleIn} />
        <Route path="/tickets/show/settle_out/:ticket_id" component={containers.SettleOut} />

        <Route path="/tickets/new/property_repair" component={containers.PropertyRepairNew} />
        <Route path="/tickets/show/property_repair/:ticket_id" component={containers.PropertyRepairShow} />
        <Route path="/tickets/new/individual_visitor" component={containers.IndividualVisitorNew} />
        <Route path="/tickets/show/individual_visitor/:ticket_id" component={containers.IndividualVisitorShow} />
        <Route path="/tickets/new/batchly_visitor" component={containers.BatchlyVisitorNew} />
        <Route path="/tickets/show/batchly_visitor/:ticket_id" component={containers.BatchlyVisitorShow} />
        <Route path="/tickets/new/complaint_advice" component={containers.ComplaintAdviceNew} />
        <Route path="/tickets/show/complaint_advice/:ticket_id" component={containers.ComplaintAdviceShow} />
        <Route path="/tickets/new/deposit_refund" component={containers.DepositRefundNew} />
        <Route path="/tickets/show/deposit_refund/:ticket_id" component={containers.DepositRefundShow} />

        <Route path="/tickets/list/goods_let/:goods_let_type" component={containers.GoodsLetList} />
        <Route path="/tickets/new/goods_letin/:goods_let_type" component={containers.GoodsLetNew} />
        <Route path="/tickets/show/goods_letin/:ticket_id" component={containers.GoodsLetShow} />
        <Route path="/tickets/new/goods_letout/:goods_let_type" component={containers.GoodsLetNew} />
        <Route path="/tickets/show/goods_letout/:ticket_id" component={containers.GoodsLetShow} />

        <Route path="/tickets/list/office_handover" component={containers.OfficeHandoverList} />
        <Route path="/tickets/show/office_handover/:ticket_id" component={containers.OfficeHandoverShow} />

        <Route path="/tickets/new/decoration_application" component={containers.DecorationApplicationNew} />
        <Route path="/tickets/show/decoration_application/:ticket_id" component={containers.DecorationApplicationShow} />
        <Route path="/tickets/new/hide_acceptance_check" component={containers.HideAcceptanceCheckNew} />
        <Route path="/tickets/show/hide_acceptance_check/:ticket_id" component={containers.HideAcceptanceCheckShow} />
        <Route path="/tickets/new/completed_acceptance_check" component={containers.CompletedAcceptanceCheckNew} />
        <Route path="/tickets/show/completed_acceptance_check/:ticket_id" component={containers.CompletedAcceptanceCheckShow} />

        <Route path="/tickets/show/:ticket_template/:ticket_id" component={containers.TicketDetail} />
        <Route path="/tickets/list/:ticket_template" component={containers.TicketList} />
        <Route path="/tickets/new/:ticket_template" component={containers.TicketNew} />
        <Route path="/tickets/show/:ticket_id" component={containers.TicketDetail} />
        <Route path="/tickets/comment/:ticket_id" component={containers.TicketComment} />

        <Route path="/applications/employees" exact component={containers.Employees} />
        <Route path="/applications/employees/show/:employee_id" component={containers.EmployeeDetail} />
        <Route path="/applications/messages/list" component={containers.MessageList} />

        <Route path="/applications/geolocation" exact component={containers.Buildings} />
        <Route path="/applications/intelligent_life" exact component={containers.IntelligentLife} />
        <Route path="/applications/living_consumption" exact component={containers.LivingConsumption} />

        <Route path="/applications/contents/list/:path" exact component={containers.ContentsList} />
        <Route path="/applications/contents/show/:alias" component={containers.ContentsDetail} />
        <Route path="/applications/contents/comment/:alias" exact component={containers.ContentsComment} />
        <Route path="/applications/contents/unify/:alias" exact component={containers.ContentsUnify} />
        <Route path="/applications/industry_map" exact component={containers.IndustryMap} />

        <Route path="/applications/ecard_recharge" exact component={containers.EcardRecharge} />
        <Route path="/applications/ecard_bill_record" exact component={containers.EcardBillRecord} />
        <Route path="/applications/ecard_cancellation" exact component={containers.EcardCancellation} />
        <Route path="/applications/ecard_report_loss" exact component={containers.EcardReportLoss} />
        <Route path="/applications/parking_service" exact component={containers.ParkingService} />
        <Route path="/applications/parking_service_apply" exact component={containers.ParkingServiceApply} />
        <Route path="/applications/parking_service_recharge" exact component={containers.ParkingServiceRecharge} />
        <Route path="/applications/parking_service_my_history" exact component={containers.ParkingServiceMyHistory} />

        <Route path="/applications/meters" component={containers.MeterList} />
        <Route path="/applications/meter/:meter_id" component={containers.MeterShow} />
      </Switch>
    </Router>
  </Provider>
  ,
  document.getElementById('app'),
);
