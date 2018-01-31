// 公众号支付
const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/wxpay');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const express = require('express');
const nwp = require('node-weixin-pay');

const Parking = require('node-parkingwang');
const parking = new Parking(config.parkingwang);

const nws = require('../lib/wxsettings').nws;
const WxService = require('../lib/wxservice');
const wxservice = new WxService(config.app);

const alipush = require('../lib/alipush');
const utilities = require('../lib/handlebars_helper');
const mdb = require('../mongoose');

const router = express.Router();

const certificate = {
  pkcs12: path.resolve(__dirname, '../cert/apiclient_cert.p12'), // 格式是文件名
  key: String(config.merchant.id),
};
const payConfig = {
  app: config.app,
  merchant: config.merchant,
  certificate,
};

// 下单支付
router.post('/unified', async (req, res) => {
  let total_fee;
  let body;
  let extensions;
  if(req.body.recharge_type === 'parking_recharge') {
    const { recharge_type, vpl_number, total_month } = req.body;
    body = `车牌${vpl_number}车位续费${total_month}个月`;
    total_fee = config.parkUnitfeeMonth * total_month;
    // 检查车牌号码
    const checkUser = await mdb.User.findOne({
      vpl_number,
    });
    if (!checkUser) {
      res.json({
        sucess: false,
        err_msg: '该车牌号不存在',
      });
      return;
    }
    extensions = {
      vpl_number,
      total_month,
      recharge_type,
    }
  }
  
  // 记录下单
  const payData = {
    user: req.$userInfo, //'5a00021b8b51ceb5588ca60c',
    body,
    total_fee,
    progress: 'unified',
    extensions,
  };

  const userPay = new mdb.UserPay(payData);
  await userPay.save();
  logger.info('save userPay:', userPay);

  // 微信下单
  const params = {
    openid: req.$token, //'oyp5_vw9kUD2QvYu04uEjzUZZn9c',
    spbill_create_ip: config.spbill_create_ip,
    notify_url: `${config.url}${config.wxpay_noti_url}`,
    body,
    out_trade_no: `${userPay._id}`,
    total_fee,
    trade_type: 'JSAPI',
  };
  logger.info('unified params:', params);

  nwp.api.order.unified(payConfig, params, async (error, data) => {
    logger.info('unified:', error, data);
    if (error) {
      res.json({
        success: false,
        msg: data,
      });
    } else {
      const result = nwp.prepay(config.app, config.merchant, data.prepay_id);
      logger.info('prepay result:', result);

      res.json({
        sucess: true,
        result, // return prepay
      });
    }
  });
});

async function payed(result) {
  const userpay = await mdb.UserPay.findByIdAndUpdate(result.out_trade_no, {
    transaction_id: result.transaction_id,
    progress: 'payed',
    payed_date: new Date(),
  }, {
    new: true,
  });
  logger.info('save payed:', userpay);

  if(userpay.extensions.recharge_type === 'parking_recharge') {
    //处理支付成功车位延期
    const vpl_number = userpay.extensions.vpl_number;
    const total_month = userpay.extensions.total_month;
    //获取最后缴费时间
    const vpl = await parking.fetchApi('/vehicle_auth/GetAuth', {
      park_code: config.parkingwang.park_code,
      vpl_number,
    });
    let validetime = moment().format('YYYY-MM-DD');
    if (vpl.data.list && vpl.data.list.length > 0) {
      logger.debug('vpl.data.list', vpl.data.list);
      validetime = moment.unix(vpl.data.list[vpl.data.list.length - 1].validetime).format('YYYY-MM-DD');
    }
    logger.debug('validetime', validetime);
    //计算截止日期
    const diff_month = total_month;
    const validbtime = moment(validetime).add(diff_month, 'month').format('YYYY-MM-DD');

    const start_time = moment(validetime).unix();
    const end_time = moment(validbtime).unix();

    logger.debug('vpl_number', vpl_number);
    logger.debug('start_time', start_time);
    logger.debug('end_time', end_time);
    const vehicle_auth_result = await parking.fetchApi('/vehicle_auth/ModifyAuthPeroid', {
      serial_number: userpay.transaction_id,
      park_code: config.parkingwang.park_code,
      vpl_number,
      start_time,
      end_time,
    });
    logger.debug('vehicle_auth_result', vehicle_auth_result);

    // 通知支付人
    await wxservice.sendtemplate(nws, result.openid, config.template.parking_wxpay_success, null, {
      first: {
        value: '月卡续费成功',
        color: '#848484',
      },
      keyword1: {
        value: vpl_number,
        color: '#848484',
      },
      keyword2: {
        value: moment(validetime).format('YYYY年MM月DD日'),
        color: '#848484',
      },
    });
    //alipush 通知
    const carUser = await mdb.User.findOne({
      vpl_number,
    });
    if (carUser) {
      const content = `车牌号“${vpl_number}”月卡续费成功，有效期至${moment(validetime).format('YYYY年MM月DD日')}`;
      const dbMessage = new mdb.Message({
        from_admin: '5a251c2a5f27a47257684115',
        to_user: carUser,
        content,
      });
      await dbMessage.save();
      // push message
      alipush.pushMessage(dbMessage._id);
    }
  }
}

// 回调 处理商户业务逻辑
router.all('/noti', (req, res) => {
  let buf = '';
  req.on('data', (chunk) => {
    buf += chunk;
  });
  req.on('end', () => {
    req.body = buf;

    nwp.callback.notify(config.app, config.merchant, req, res, (error, result) => {
      logger.info('noti:', error, result);

      try {
        payed(result);
      } catch (err) {
        logger.error(err);
      }
    });
  });
});

module.exports = router;
