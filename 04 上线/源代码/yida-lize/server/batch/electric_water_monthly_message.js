#!/usr/bin/env node

/**
 * 每个月的9号，提醒企业客户，即将进行抄表作业（如9号为节假日，顺延）
 * 本batch应该每月
 */
const config = require('../config');
const logger = require('../lib/logging').getLogger('electric_water_monthly_message');

const _ = require('lodash');
const mdb = require('../mongoose');
const alipush = require('../lib/alipush');

const biz = async () => {
  await Promise.all(_.map(await mdb.User.find({
    role: '授权人',
  }).select('_id'), async (to_user) => {
    const dbMessage = new mdb.Message({
      from_admin: '5a251c2a5f27a47257684115',
      business_type: 'meter',
      extensions: {
        user_url: '/applications/meters',
      },
      content: '水电煤抄表通知: 每个月的9号，即将进行抄表作业（如9号为节假日，顺延）',
      to_user,
    });
    await dbMessage.save();
    // push message
    await alipush.pushMessage(dbMessage._id);
  }));
};

biz().then(() => {
  process.exit();
});

