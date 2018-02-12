#!/usr/bin/env node

/**
 * 维修人员接单后半小时之内无反馈，提醒工程经理
 * 本batch应该每分钟的执行
 */
const config = require('../config');
const logger = require('../lib/logging').getLogger('repair_team_expire_minute_message');

const moment = require('moment');
const _ = require('lodash');
const mdb = require('../mongoose');
const alipush = require('../lib/alipush');

const biz = async () => {
  const tickets = await mdb.Ticket.find({
    ticket_template: 'property_repair',
    progress: '任务接单',
  }).select('content form_data');

  logger.warn('维修人员接单后半小时之内无反馈', tickets);
  await Promise.all(_.map(tickets, async (ticket) => {
    if (moment().diff(moment(ticket.form_data.assign_date), 'minute') > 30) {
      await Promise.all(_.map(await mdb.Admin.find({
        acl_roles: {
          $in: ['repair_manager'],
        },
      }).select('_id'), async (to_admin) => {
        const dbMessage = new mdb.Message({
          from_admin: '5a251c2a5f27a47257684115',
          business_type: 'property_repair',
          content: `维修订单:维修人员接单后半小时之内无反馈：${ticket.content}`,
          to_admin,
          extensions: {
            staff_url: `/crud/property_repair/${ticket._id}`,
          },
        });
        await dbMessage.save();
        // push message
        await alipush.pushMessage(dbMessage._id);
      }));
    }
  }));
};

biz().then(() => {
  process.exit();
});
