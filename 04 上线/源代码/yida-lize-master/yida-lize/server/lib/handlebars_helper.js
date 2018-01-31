/**
 * Handlebars的帮助
 */
const config = require('../config');
const logger = require('../lib/logging').getLogger('lib/handlebars_helper');

const util = require('util');
const _ = require('lodash');
const moment = require('moment');
const numeral = require('numeral');
const acl = require('./auth/acl');

exports.helper = {
  eq: (v1, v2) => v1 === v2,
  about_eq: (v1, v2) => {
    if (v1 && v2) {
      return v1.toString() == v2.toString();
    }
    return false;
  },
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and: (v1, v2) => v1 && v2,
  or: (v1, v2) => v1 || v2,
  add: (v1, v2) => v1 + v2,
  minus: (v1, v2) => v1 - v2,
  multiply: (v1, v2) => parseInt(v1 * v2, 10),
  split: (str, s) => str.split(s),
  contains: (s, v) => s && ((s === v) || (s.split(',').indexOf(v) > -1)),
  exists: (list, key) => (list ? list.indexOf(key) > -1 : false),
  not_exists: (list, key) => (list ? list.indexOf(key) < 0 : true),
  intersection: (list, key) => {
    key = JSON.parse(key);
    return _.intersection(list, key).length > 0;
  },
  about_exists: (list, key) => {
    for (const item of list) {
      if (item == key) {
        return true;
      }
    }
    return false;
  },
  divide: (v1, v2) => v1 / v2,
  delete_flag: delete_flag => (delete_flag === true ? '无效' : '有效'),
  sex_title: sex => (sex > 0 ? (sex == 1 ? '男' : '女') : ''),
  pay_progress: progress => (progress == 'unified' ? '未支付' : '已支付'),
  pay_event_type: (event_type) => {
    if (event_type == 'room_fee') {
      return '物业费';
    } else if (event_type == 'parkspace_fee') {
      return '车位费';
    }
    return event_type;
  },
  user_roles: (user_roles) => {
    const roles = config.acl.roles;
    const result = _.join(_.map(user_roles, (user_role) => {
      const index = _.findIndex(roles, role => role.id == user_role);
      if (roles[index]) {
        return roles[index].text;
      }
    }), ',');

    return result;
  },
  lodash_map: (collection, key) => _.map(collection, key),
  abbr: (v, length) => {
    if (v) {
      return `${v.substring(0, length)}${v.length > length ? '...' : ''}`;
    }
    return '';
  },
  currency_format: currency => `${numeral(parseFloat(currency / 100)).format("0,0.00")}元`,
  now: f => moment().format(f),
  now_add: (n, unit, f) => moment().add(n, unit).format(f),
  ymd: (date, f) => (date ? moment(date).format(f) : ''),
  ymd_add: (date, n, unit, f) => moment(date).add(n, unit).format(f),
  not: v1 => !v1,
  toJSON: object => JSON.stringify(object),
  format: (str, arg) => util.format(str, arg),
  minute2hms: (timer) => {
    const t = timer * 60;
    const h = parseInt(t / 3600, 10);
    const m = parseInt((t % 3600) / 60, 10);
    const s = parseInt(t % 60, 10);

    const hours = h < 10 ? `0${h}` : h;
    const minutes = m < 10 ? `0${m}` : m;
    const seconds = s < 10 ? `0${s}` : s;

    return `${hours}:${minutes}:${seconds}`;
  },
  km2meter: km =>
    numeral(parseInt(km * 1000, 10)).format('0,0'),
  times: (n, block) => {
    let accum = '';
    for (let i = 0; i < n; i += 1) {
      accum += block.fn(i);
    }
    return accum;
  },
  join: (v1, v2) => v1.concat(v2),
  avatar: (site, uri) => uri && uri.startsWith('http') ? uri : `${site}/${uri}`,
  separate: templates => _.join(_.map(templates, template => template._id), ','),
  isAllowed: (permissions, resource, permission) =>
    acl.isAllowed(permissions, resource, permission),
  nextStep: (curr, progresses) => {
    for (let i in progresses) {
      if (curr === progresses[i].step) {
        i = parseInt(i);
        return (i === progresses.length - 1) ? '' : progresses[i + 1].step;
      }
    }
    return null;
  },
  canNextStep: (curr, progresses, userRoles) => {
    for (const step of progresses) {
      if (curr === step.step) {
        logger.debug(step.roles, userRoles, _.intersection(step.roles, userRoles));
        return _.intersection(step.roles, userRoles).length > 0;
      }
    }
    return null;
  },
  progress_gte: (p1, p2, progresses) => {
    let pi1 = 0;
    let pi2 = 0;
    for (const i in progresses) {
      if (p1 === progresses[i].step) {
        pi1 = parseInt(i);
      }
      if (p2 === progresses[i].step) {
        pi2 = parseInt(i);
      }
    }
    return pi1 >= pi2;
  },
  paginationView: (pagination) => {
    if (!pagination) {
      return '';
    }
    const page = parseInt(pagination.page, 10);
    const page_start_logic = page - (config.pagerSize / 2);

    const pagerStart = page_start_logic > 0 ? page_start_logic : 1;
    let pagerEnd = (pagerStart + config.pagerSize) - 1;
    if (pagerEnd > pagination.pageCount) {
      pagerEnd = pagination.pageCount;
    }

    let pagePrev = page - config.pagerSize;
    if (pagePrev <= 0) {
      pagePrev = 1;
    }
    let pageNext = page + config.pagerSize;
    if (pageNext > pagination.pageCount) {
      pageNext = pagination.pageCount;
    }

    let html = `
<ul class="pagination pagination-sm no-margin">
<li><a href="javascript:;" data-id="${pagePrev}" class="pageList">&laquo;</a></li>
`;
    for (let i = pagerStart; i <= pagerEnd; i += 1) {
      let style = '';
      if (i === page) style = 'font-weight: 900;';
      html += `<li><a style="${style}" href="javascript:;" data-id="${i}" class="pageList">${i}</a></li>`;
    }

    html += `
<li><a href="javascript:;" data-id="${pageNext}" class="pageList">&raquo;</a></li>
</ul>
<span style="display: block;">共${pagination.rowCount}条数据</span>
`;
    return html;
  },
  simpleDate: (dateStr) => {
    const myMoment = moment(dateStr);
    const now = moment();
    const diff = myMoment.diff(now, 'days', true);
    if (diff > -1) {
      return '今天';
    } else if (diff > -2) {
      return '昨天';
    } else if (diff > -3) {
      return '前天';
    }
    return myMoment.format('YYYY-MM-DD');
  },
  isInclude: (acl_roles, role) => acl_roles.indexOf(role) >= 0,
};
