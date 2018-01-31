const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/parking');
const _ = require('lodash');
const moment = require('moment');

const express = require('express');

const router = express.Router();
const ECard = require('../lib/ecard');

// curl -X GET https://admin.yidalize.com/ecard/bill_record -H "Authorization: Bearer JDJhJDEwJDBLN01mY0Y5RlFhQW1maS9xMi80cnVLVEdEcXlpcWlYVHZvN0wyNEdSelFPbGlLMG1JcUFl"
router.get('/bill_record', async (req, res, next) => {
  try {
    if (!req.$userInfo.e_card) {
      return res.json({
        success: false,
        msg: '没有找到您的一卡通号码',
      });
    }

    const ecard = new ECard();
    const consume_list = await ecard.consume_list(req.$userInfo.e_card);
    const recharge_list = await ecard.recharge_list(req.$userInfo.e_card);

    const list = _.sortBy(_.concat(consume_list, recharge_list), 'recid');
    res.json({
      success: true,
      list,
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
