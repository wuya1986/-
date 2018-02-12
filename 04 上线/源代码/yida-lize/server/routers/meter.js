const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/ticket');
const _ = require('lodash');
const alipush = require('../lib/alipush');

const express = require('express');
const mdb = require('../mongoose');

const router = express.Router();

router.get('/meters', async (req, res, next) => {
  try {
    const meter = await mdb.Meter.find({ company: req.$userInfo.company._id }).sort({
      _id: 1,
    });
    res.json({
      success: true,
      data: meter,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

router.get('/meter/:_id', async (req, res, next) => {
  try {
    const meter = await mdb.Meter.findById(req.params._id);
    res.json({
      success: true,
      data: meter,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// 确认
router.post('/confirm_meter_reading', async (req, res, next) => {
  try {
    const { meter_readings_id } = req.body;
    const meter = await mdb.Meter.findOneAndUpdate({
      meter_readings: {
        $elemMatch: {
          _id: meter_readings_id,
        },
      },
    }, {
      $set: {
        'meter_readings.$.company_confirm': req.$userInfo.fullname,
      },
    }, {
      new: true,
    });
    await Promise.all(_.map(await mdb.Admin.find({
      acl_roles: {
        $in: ['repair_manager'],
      },
    }).select('_id'), async (to_admin) => {
      const dbMessage = new mdb.Message({
        from_user: req.$userInfo._id,
        to_admin,
        content: '已确认',
        extensions: {
          staff_url: `/crud/company${req.$userInfo.company._id}`,
        },
      });
      await dbMessage.save();
      // push message
      alipush.pushMessage(dbMessage._id);
    }));

    res.json({
      success: true,
      data: meter,
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
