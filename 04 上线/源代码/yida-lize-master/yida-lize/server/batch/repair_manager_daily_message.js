#!/usr/bin/env node

/**
 * 每天16：00点前如果有未完成的维修订单，提醒工程经理
 * 本batch应该每天的16:00执行
 */
const config = require('../config');
const logger = require('../lib/logging').getLogger('property_repair_daily_message');

const _ = require('lodash');
const mdb = require('../mongoose');
const alipush = require('../lib/alipush');

const biz = async () => {
  const count = await mdb.Ticket.count({
    ticket_template: 'property_repair',
    progress: {
      $ne: '处理完毕',
    },
  });
  if (count > 0) {
    const content = `维修订单：16：00点前有${count}件未完成的维修订单，请确认`;
    await Promise.all(_.map(await mdb.Admin.find({
      acl_roles: {
        $in: ['repair_manager'],
      },
    }).select('_id'), async (to_admin) => {
      const dbMessage = new mdb.Message({
        from_admin: '5a251c2a5f27a47257684115',
        business_type: 'property_repair',
        content,
        to_admin,
        extensions: {
          staff_url: '/crud/property_repairs/',
        },
      });
      await dbMessage.save();
      // push message
      await alipush.pushMessage(dbMessage._id);
    }));
  }
};

biz().then(() => {
  process.exit();
});

