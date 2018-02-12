/**
 * Module dependencies.
 */
const logger = require('../lib/logging').getLogger('lib/autoloader');
const path = require('path');
const fs = require('fs');

const Autoloader = function () {
  const controllers = this.controllers = [];

  fs.readdirSync(path.join(__dirname, '/../controllers')).forEach((name) => {
    // logger.debug(name);
    if (name.endsWith('.js')) {
      controllers.push(name.split('.')[0]);
    }
  });
};

Autoloader.prototype = {

  load(parentApp) {
    const authCheck = function (req, res, next) {
      if (req.session.user) {
        next();
      } else {
        req.session.error = '请重新登录!';
        res.redirect('/login');
      }
    };
    this.controllers.forEach((controller) => {
      const obj = require(`../controllers/${controller}.js`);
      controller = obj.name || controller;
      const names = Array.isArray(controller) ? controller : [controller];
      const prefix = obj.prefix || '';
      const before = obj.before || false;

      // logger.debug(controller, names);
      // generate routes based
      // on the exported methods
      names.map((name) => {
        for (const key in obj) {
          let method;
          let uri;
          // 'reserved' exports
          if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
          // route exports
          switch (key) {
            case 'list':
              method = 'get';
              uri = `/${name}s`;
              break;
            case 'show':
              method = 'get';
              uri = `/${name}/:_id`;
              break;
            case 'new':
              method = 'get';
              uri = `/${name}/new`;
              break;
            case 'create':
              method = 'post';
              uri = `/${name}`;
              break;
            case 'edit':
              method = 'get';
              uri = `/${name}/:_id/edit`;
              break;
            case 'update':
              method = 'put';
              uri = `/${name}/:_id`;
              break;
            case 'remove':
              method = 'get';
              uri = `/${name}/:_id/remove`;
              break;
            case 'delete':
              method = 'delete';
              uri = `/${name}/:_id`;
              break;
            case 'index':
              method = 'get';
              uri = (prefix === '') ? '/' : '';
              break;
            default:
              if (key.indexOf('get_') === 0) {
                method = 'get';
              } else if (key.indexOf('post_') === 0) {
                method = 'post';
              } else if (key.indexOf('delete_') === 0) {
                method = 'delete';
              } else if (key.indexOf('put_') === 0) {
                method = 'put';
              } else {
                method = 'get';
              }
              uri = `/${key}`;
          }

          uri = prefix + uri;
          const routeName = `${name}.${key}`;

          if (before) {
            parentApp[method](uri, routeName, authCheck, before, obj[key]);
            // logger.debug(method.toUpperCase(), uri, '-> before ->', routeName);
          } else {
            parentApp[method](uri, routeName, authCheck, obj[key]);
            // logger.debug(method.toUpperCase(), uri, '->', routeName);
          }
        }
      });
    });
  },
};

module.exports = new Autoloader();
