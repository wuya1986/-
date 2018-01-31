import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import ReactSVG from 'react-svg';

import advertising_reservation from '../assets/SVG/advertising_reservation.svg';
import batchly_charge from '../assets/SVG/batchly_charge.svg';
import batchly_visitors from '../assets/SVG/batchly_visitors.svg';
import big_events from '../assets/SVG/big_events.svg';
import book_dinner from '../assets/SVG/book_dinner.svg';
import bus_info from '../assets/SVG/bus_info.svg';
import cafes from '../assets/SVG/cafes.svg';
import canvass_business_center from '../assets/SVG/canvass_business_center.svg';
import certificate_employee from '../assets/SVG/certificate_employee.svg';
import complaint_advice from '../assets/SVG/complaint_advice.svg';
import complaints_advices from '../assets/SVG/complaints_advices.svg';
import completed_acceptance_check from '../assets/SVG/completed_acceptance_check.svg';
import consumer_QRCode from '../assets/SVG/consumer_QRCode.svg';
import convenient_store from '../assets/SVG/convenient_store.svg';
import decoration_application from '../assets/SVG/decoration_application.svg';
import deposit_refund from '../assets/SVG/deposit_refund.svg';
import enterprise_service from '../assets/SVG/enterprise_service.svg';
import entrance_QRCode from '../assets/SVG/entrance_QRCode.svg';
import equipment_io from '../assets/SVG/equipment_io.svg';
import event_manage from '../assets/SVG/event_manage.svg';
import geolocation from '../assets/SVG/geolocation.svg';
import goods_letin from '../assets/SVG/goods_letin.svg';
import goods_letout from '../assets/SVG/goods_letout.svg';
import guest_visit from '../assets/SVG/guest_visit.svg';
import hide_acceptance_check from '../assets/SVG/hide_acceptance_check.svg';
import individual_visitors from '../assets/SVG/individual_visitors.svg';
import industry_alliance from '../assets/SVG/industry_alliance.svg';
import industry_map from '../assets/SVG/industry_map.svg';
import industry_services from '../assets/SVG/industry_services.svg';
import intelligent_life from '../assets/SVG/intelligent_life.svg';
import living_consumption from '../assets/SVG/living_consumption.svg';
import living_room from '../assets/SVG/living_room.svg';
import meeting_room_booking from '../assets/SVG/meeting_room_booking.svg';
import more from '../assets/SVG/more.svg';
import no_standard_services from '../assets/SVG/no_standard_services.svg';
import notice_news from '../assets/SVG/notice_news.svg';
import notification_center from '../assets/SVG/notification_center.svg';
import office_decoration from '../assets/SVG/office_decoration.svg';
import office_handover from '../assets/SVG/office_handover.svg';
import park_activity from '../assets/SVG/park_activity.svg';
import park_canteen from '../assets/SVG/park_canteen.svg';
import park_introduction from '../assets/SVG/park_introduction.svg';
import parking_area from '../assets/SVG/parking_area.svg';
import parking_reservation from '../assets/SVG/parking_reservation.svg';
import parking_service from '../assets/SVG/parking_service.svg';
import property_lease from '../assets/SVG/property_lease.svg';
import property_repair from '../assets/SVG/property_repair.svg';
import property_service from '../assets/SVG/property_service.svg';
import reserve_visit from '../assets/SVG/reserve_visit.svg';
import scanning_QRCode from '../assets/SVG/scanning_QRCode.svg';
import settle_in from '../assets/SVG/settle_in.svg';
import settle_io from '../assets/SVG/settle_io.svg';
import settle_out from '../assets/SVG/settle_out.svg';
import shared_office from '../assets/SVG/shared_office.svg';
import standard_services from '../assets/SVG/standard_services.svg';
import venue_booking from '../assets/SVG/venue_booking.svg';
import vr_map from '../assets/SVG/vr_map.svg';
import meter from '../assets/SVG/meter.svg';
import zone_policy from '../assets/SVG/zone_policy.svg';

export default class Svg extends Component {
  render() {
    const icon_id = this.props.icon_id;

    let img_module;

    if (icon_id === 'advertising_reservation') {
      img_module = advertising_reservation;
    } else if (icon_id === 'batchly_charge') {
      img_module = batchly_charge;
    } else if (icon_id === 'batchly_visitors') {
      img_module = batchly_visitors;
    } else if (icon_id === 'big_events') {
      img_module = big_events;
    } else if (icon_id === 'book_dinner') {
      img_module = book_dinner;
    } else if (icon_id === 'bus_info') {
      img_module = bus_info;
    } else if (icon_id === 'cafes') {
      img_module = cafes;
    } else if (icon_id === 'canvass_business_center') {
      img_module = canvass_business_center;
    } else if (icon_id === 'certificate_employee') {
      img_module = certificate_employee;
    } else if (icon_id === 'complaint_advice') {
      img_module = complaint_advice;
    } else if (icon_id === 'complaints_advices') {
      img_module = complaints_advices;
    } else if (icon_id === 'completed_acceptance_check') {
      img_module = completed_acceptance_check;
    } else if (icon_id === 'consumer_QRCode') {
      img_module = consumer_QRCode;
    } else if (icon_id === 'convenient_store') {
      img_module = convenient_store;
    } else if (icon_id === 'decoration_application') {
      img_module = decoration_application;
    } else if (icon_id === 'deposit_refund') {
      img_module = deposit_refund;
    } else if (icon_id === 'enterprise_service') {
      img_module = enterprise_service;
    } else if (icon_id === 'entrance_QRCode') {
      img_module = entrance_QRCode;
    } else if (icon_id === 'equipment_io') {
      img_module = equipment_io;
    } else if (icon_id === 'event_manage') {
      img_module = event_manage;
    } else if (icon_id === 'geolocation') {
      img_module = geolocation;
    } else if (icon_id === 'goods_letin') {
      img_module = goods_letin;
    } else if (icon_id === 'goods_letout') {
      img_module = goods_letout;
    } else if (icon_id === 'guest_visit') {
      img_module = guest_visit;
    } else if (icon_id === 'hide_acceptance_check') {
      img_module = hide_acceptance_check;
    } else if (icon_id === 'individual_visitors') {
      img_module = individual_visitors;
    } else if (icon_id === 'industry_alliance') {
      img_module = industry_alliance;
    } else if (icon_id === 'industry_map') {
      img_module = industry_map;
    } else if (icon_id === 'industry_services') {
      img_module = industry_services;
    } else if (icon_id === 'intelligent_life') {
      img_module = intelligent_life;
    } else if (icon_id === 'living_consumption') {
      img_module = living_consumption;
    } else if (icon_id === 'living_room') {
      img_module = living_room;
    } else if (icon_id === 'meeting_room_booking') {
      img_module = meeting_room_booking;
    } else if (icon_id === 'more') {
      img_module = more;
    } else if (icon_id === 'no_standard_services') {
      img_module = no_standard_services;
    } else if (icon_id === 'notice_news') {
      img_module = notice_news;
    } else if (icon_id === 'notification_center') {
      img_module = notification_center;
    } else if (icon_id === 'office_decoration') {
      img_module = office_decoration;
    } else if (icon_id === 'office_handover') {
      img_module = office_handover;
    } else if (icon_id === 'park_activity') {
      img_module = park_activity;
    } else if (icon_id === 'park_canteen') {
      img_module = park_canteen;
    } else if (icon_id === 'park_introduction') {
      img_module = park_introduction;
    } else if (icon_id === 'parking_area') {
      img_module = parking_area;
    } else if (icon_id === 'parking_reservation') {
      img_module = parking_reservation;
    } else if (icon_id === 'parking_service') {
      img_module = parking_service;
    } else if (icon_id === 'property_lease') {
      img_module = property_lease;
    } else if (icon_id === 'property_repair') {
      img_module = property_repair;
    } else if (icon_id === 'property_service') {
      img_module = property_service;
    } else if (icon_id === 'reserve_visit') {
      img_module = reserve_visit;
    } else if (icon_id === 'scanning_QRCode') {
      img_module = scanning_QRCode;
    } else if (icon_id === 'settle_in') {
      img_module = settle_in;
    } else if (icon_id === 'settle_io') {
      img_module = settle_io;
    } else if (icon_id === 'settle_out') {
      img_module = settle_out;
    } else if (icon_id === 'shared_office') {
      img_module = shared_office;
    } else if (icon_id === 'standard_services') {
      img_module = standard_services;
    } else if (icon_id === 'venue_booking') {
      img_module = venue_booking;
    } else if (icon_id === 'vr_map') {
      img_module = vr_map;
    } else if (icon_id === 'meter') {
      img_module = meter;
    } else if (icon_id === 'zone_policy') {
      img_module = zone_policy;
    }

    return (<ReactSVG
      path={img_module}
      style={{ fill: '#64b9fb', width: 30 }}
    />);
  }
}

Svg.propTypes = {
  icon_id: PropTypes.string,
};

Svg.defaultProps = {
  icon_id: '',
};
