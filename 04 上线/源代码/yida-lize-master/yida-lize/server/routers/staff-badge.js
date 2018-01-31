const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/staff-badge');
const mdb = require('../mongoose');

const _ = require('lodash');
const express = require('express');
const redis = require('promise-redis')();
const mongoose = require('mongoose');

const redisClient = redis.createClient(config.redis);

const router = express.Router();

// curl -X GET https://admin.yidalize.com/staff-badge/data -H "Authorization: Bearer JDJhJDEwJG1zdGZBdVBXWnh5ZTk2TkNpZlU3aE8zUGNpSkg3QUxMemtZWVE3Y09hQk1nWGJNN0Y3MFhD"
router.get('/data', async (req, res, next) => {
  try {
    const staff = req.$staffInfo ? req.$staffInfo : req.session.user;

    const messages = await mdb.Message.count({
      readers_admin: {
        $elemMatch: {
          admin: staff._id,
          hasRead: false,
        },
      },
    });
    const push_badge_key = `${staff.push_device_id}_push_badge`;
    redisClient.set(push_badge_key, messages);

    const ticket_criteria = {
      progress: {
        $ne: '处理完毕',
      },
      $or: [{
        to: {
          $in: [mongoose.Schema.Types.ObjectId(staff._id)],
        },
      }, {
        cc: {
          $in: [mongoose.Schema.Types.ObjectId(staff._id)],
        },
      }],
    };

    res.json({
      success: true,
      staff,
      data: {
        applications: await mdb.Ticket.aggregate([
          {
            $match: {
              progress: {
                $ne: '处理完毕',
              },
            },
          },
          {
            $group: {
              _id: '$ticket_template',
              count: { $sum: 1 },
            },
          },
        ]),
        mine: {
          messages,
          tickets: await mdb.Ticket.count(ticket_criteria),
        },
      },
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
