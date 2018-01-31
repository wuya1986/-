var path = require('path');
var _ = require('lodash');
var router = require('express').Router();
var requireAll = require('require-all');
var routerTable = require('../core/router');

/**
 * 读取控制器
 */
var controllers = requireAll({
  dirname: path.join(__dirname, '../core/controllers/'),
  filter: /(.+)\.controller\.js$/
});

/**
 * 递归绑定控制器
 * @param  {Object} Router JSON
 */
(function loop (map, route) {
  route = route || '';

  _.forEach(map, function (value, key) {
    if (_.isObject(value) && !_.isArray(value)) {
      // { '/path': { ... }}
      loop(value, route + key);
    } else {
      var controller;
      var action;

        // get: 'controller.action'
        // 获取控制器和动作
        controller = value.split('.')[0];
        action = value.split('.')[1];


      try {
        if (action) {
          router[key](route, controllers[controller][action]);
        } else if (controller) {
          router[key](route, controllers[controller]);
        }
      } catch (e) {
        console.log('error', action, controller, key);
      }
    }
  });
})(routerTable);

module.exports = router;
