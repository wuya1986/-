const config = require('../config');

const logger = require('../lib/logging').getLogger('lib/wxsettings');
const nws = exports.nws = require('node-weixin-settings');
const _ = require('lodash');
const redis = require('promise-redis')();

const redisClient = redis.createClient(config.redis);

const prefix = 'wx_';
nws.registerSet((id, key, value, cb) => {
  logger.debug('registerSet %s %s %s', id, key, JSON.stringify(value));
  const k = `${prefix}${id}_${key}`;
  redisClient.setex(k, ((2 * 60 * 60) - 60), JSON.stringify(value)); // 2h - 60s
  cb(null);
});
nws.registerGet(async (id, key, cb) => {
  let value = null;
  try {
    const k = `${prefix}${id}_${key}`;
    const v = await redisClient.get(k);
    value = JSON.parse(v);
  } catch (e) {
    logger.error(e);
  }
  cb(value);
});
