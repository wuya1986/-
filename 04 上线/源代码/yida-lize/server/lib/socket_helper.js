/**
 * socket的帮助
 */
const config = require('../config');
const logger = require('../lib/logging').getLogger('lib/socket_helper');

const _ = require('lodash');
const redis = require('promise-redis')();

const redisClient = redis.createClient(config.redis);


exports.helper = (socket) => {
  logger.debug('user connected:', socket.id);

  socket.on('user_id', (user_id) => {
    logger.debug('user_socket set :', user_id, socket.id);
    redisClient.setex(`user_socket${user_id}`, 24 * 60 * 60, socket.id);
  });

  socket.on('disconnect', () => {
    logger.debug('disconnect');
  });
};
