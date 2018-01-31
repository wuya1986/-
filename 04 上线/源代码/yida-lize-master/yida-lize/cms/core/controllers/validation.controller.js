var _ = require('lodash');
var logger = require('../../lib/logger.lib');
var usersService = require('../services/users.service');

/**
 * 验证用户权限
 * @param {[Number]} authorities
 */
module.exports = function (authorities) {
  return function (req, res, next) {
    var _id = req.session.user._id;

    usersService.one({_id: _id}, function (err, user) {
      if (err) {
        logger[err.type]().error(__filename, err);
        return res.status(500).end();
      }

      if (user) {
        return true;
      } else {
        res.status(404).json({
          error: {
            code: 'USER_NOT_FOUND',
            message: '找不到用户或用户不存在'
          }
        });
      }
    });
  };
};
