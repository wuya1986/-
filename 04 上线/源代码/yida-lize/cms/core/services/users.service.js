var async = require('async');
var _ = require('lodash');
var logger = require('../../lib/logger.lib');
var usersModel = require('../models/admins.model');

/**
 * 查询用户
 * @param {Object} options
 *        {String} options.username
 *        {MongoId} options._id
 * @param callback
 */
exports.one = function (options, callback) {
  /* callback(null, {
   *   _id: '5a0081dc52ccaa4efea2ef6b',
   *   fullname:'zhaolei',
   *   username:'zhaolei@qq.com',
   *   password: '$2a$10$8pmfUnqXvuR5hnoMeDJzg.wpS79rROFySwtzys8wI2AsSeSUGc0uG',
   * });
   * return;
   */
  var query = {};

  if (options.username) query.username = options.username;
  if (options._id) query._id = options._id;

  usersModel.findOne(query)
    .select('type fullname username password role acl_roles')
    .lean()
    .exec(function (err, user) {
      if (err) {
        err.type = 'database';
        return callback(err);
      }

      if (!user) return callback();


      callback(null, user);
    });
};
