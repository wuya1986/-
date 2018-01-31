const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/parking');
const _ = require('lodash');
const moment = require('moment');

const Parking = require('node-parkingwang');
const express = require('express');

const router = express.Router();

const parking = new Parking(config.parkingwang);
// curl -X GET https://admin.yidalize.com/parking/query
router.get('/query', async (req, res, next) => {
  try {
    const parking_info = await parking.fetchApi('/park/QueryByCode', {
      park_code: config.parkingwang.park_code,
    });
    res.json({
      success: true,
      parking_info,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});
// curl -X GET https://admin.yidalize.com/parking/getauth
router.get('/getauth', async (req, res, next) => {
  try {
    const vpl_number = req.$userInfo.vpl_number;
    if (!vpl_number) {
      return res.json({
        success: false,
        msg: '没有找到您的车牌号码',
      });
    }
    const vpl = await parking.fetchApi('/vehicle_auth/GetAuth', {
      park_code: config.parkingwang.park_code,
      vpl_number,
    });
    res.json({
      success: true,
      list: vpl.data.list,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

module.exports = router;
