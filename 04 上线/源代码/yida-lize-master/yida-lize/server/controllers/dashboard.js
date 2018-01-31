const logger = require('../lib/logging').getLogger('controllers/dashboard');
const config = require('../config');
const mdb = require('../mongoose');
const _ = require('lodash');
const acl = require('../lib/auth/acl');

const moment = require('moment');

exports.prefix = '/dashboard';
exports.index = async (req, res) => {
  
  let user_month_data = [];
  let ticket_month_data = [];
  let user_type_data = [];
  for(let i = 11; i >= 0; i--) {
    const month = moment().subtract(i, 'months');
    const month_key = month.format('YYYY-MM');
    const startDate = moment(month).format('YYYY-MM-01');
    const endDate = moment(month).add(1, 'months').format('YYYY-MM-01');

    const users_count = await mdb.User.count({
      delete_flag: 0,
      create_date: {"$gte": startDate, "$lt": endDate},
    });
    user_month_data.push({month_key,users_count});

    const tickets_total_count = await mdb.Ticket.count({
      delete_flag: 0,
      create_date: {"$gte": startDate, "$lt": endDate},
    });
    const tickets_over_count = await mdb.Ticket.count({
      delete_flag: 0,
      progress: '处理完毕',
      create_date: {"$gte": startDate, "$lt": endDate},
    });
    ticket_month_data.push({month_key,tickets_total_count,tickets_over_count});
  }

  const users = await mdb.User.find({delete_flag: 0}).select('role');

  user_type_data.push({label: "访客", value: _.size(_.filter(users, {'role': '访客'}))});
  user_type_data.push({label: "园区客户", value: _.size(_.filter(users, {'role': '园区客户'}))});
  user_type_data.push({label: "授权人", value: _.size(_.filter(users, {'role': '授权人'}))});

  user_month_data = JSON.stringify(user_month_data);
  ticket_month_data = JSON.stringify(ticket_month_data);
  user_type_data = JSON.stringify(user_type_data);

  res.render('dashboard/index', {
    title: 'Dashboard',
    user_month_data,
    ticket_month_data,
    user_type_data,
  });
};
