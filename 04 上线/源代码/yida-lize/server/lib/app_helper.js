/**
 * app的帮助
 */
const config = require('../config');
const logger = require('../lib/logging').getLogger('lib/app_helper');

const _ = require('lodash');
const redis = require('promise-redis')();

const redisClient = redis.createClient(config.redis);


exports.helper = (app, io) => {
  app.on('event_test', (user_id) => {
    logger.debug('event_test:', user_id);
  });

  app.on('login_result', async (user_id, data) => {
    logger.debug('app.on login_result:', user_id);
    const socket_id = redisClient.get(`user_socket${user_id}`);
    io.to(socket_id).emit('login_result', data);
  });
};
