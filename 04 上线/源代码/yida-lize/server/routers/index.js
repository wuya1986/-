//首页的4个Tab入口
const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/index');

const bcrypt = require('bcrypt-as-promised');
const _ = require('lodash');
const util = require('util');

const express = require('express');
const redis = require('promise-redis')();

const nwApi = require('node-weixin-api');

const mdb = require('../mongoose');

const redisClient = redis.createClient(config.redis);
const router = express.Router();
const nwo = nwApi.oauth;

const nws = require('../lib/wxsettings').nws;

const token_seconds = 60 * 60 * 24 * 7;
const EMPLOYEE_SELECT = 'fullname avatar mobile_no openid sex dob id_card e_card vpl_number company request_employee role delete_flag push_device_id push_device_type';

const getAuthInfo = async (criteria, token) => {
  let user = await mdb.User.findOne(criteria)
    .select(EMPLOYEE_SELECT)
    .populate('company');
  if (user) {
    user = user.toObject();

    if (!token) {
      token = new Buffer(await bcrypt.hash(user._id + moment().unix(), config.saltRounds)).toString('base64');
      logger.info('new token', token, user);
    }
    user.token = token;

    redisClient.setex(token, token_seconds, JSON.stringify(user));
  }
  return user;
};

router.post('/log', (req, res) => {
  logger.info(req.body);
  res.end();
});

router.get('/redirect_oauth', (req, res, next) => {
  const gourl = req.query.gourl;
  const redirectUri = `${config.url}/oauth?action=${encodeURIComponent(gourl)}`;
  const state = 1;
  const userInfo = 1;
  const url = nwo.createURL(config.app.id, redirectUri, state, userInfo);
  logger.info('url:', url);
  res.redirect(url);
});

router.get('/oauth', (req, res, next) => {
  logger.info(req.query);
  const action = req.query.action;
  nwo.success(config.app, req.query.code, (err, body) => {
    logger.info('body:', body);
    logger.info('nwo.session:', nwo.session);

    if (err) {
      logger.error('nwo err:', err, body);
      next(err);
    } else {
      const openid = body.openid;
      const access_token = body.access_token;

      nwo.profile(openid, access_token, async (error, body2) => {
        logger.info('body2:', body2);
        const user = await mdb.User.findOneAndUpdate({
          openid,
        }, {
          $push: {
            events: {
              $each: [{
                content: 'oauth login',
              }],
              $position: 0,
            },
          },
          ...body2,
          fullname: body2.nickname,
          avatar: body2.headimgurl,
        }, {
          upsert: true,
          setDefaultsOnInsert: true,
          new: true,
        });
        logger.info('update user', user);

        await getAuthInfo({
          openid,
          delete_flag: false,
        }, openid);

        res.redirect(`${action}?token=${openid}`);
      });
    }
  });
});

module.exports = router;
