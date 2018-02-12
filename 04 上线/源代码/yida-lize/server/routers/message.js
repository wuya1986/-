const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/message');
const express = require('express');
const mdb = require('../mongoose');
const redis = require('promise-redis')();

const redisClient = redis.createClient(config.redis);

const router = express.Router();

// 我的所有的message
// curl -X GET https://admin.yidalize.com/message/user_messages  -d '{"token": "JDJhJDEwJGdyZXd2cGREOWVVUnNyTUlyRW1kM2VGalo1SC5tMTZHbTdITTJWWGhHZ1F1VFBGSWJ0TzRD"}'
router.get('/user_messages', async (req, res, next) => {
  try {
    const messages = await mdb.Message.find({
      to_user: req.$userInfo._id,
    })
      .populate('from_admin', 'fullname avatar')
      .populate('from_user', 'fullname avatar')
      .sort({
        _id: -1,
      })
      .limit(config.pageSize);

    res.json({
      success: true,
      data: messages,
    });
    // hasRead
    await mdb.Message.update({
      to_user: req.$userInfo._id,
    }, {
      hasRead: true,
    }, {
      multi: true,
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
