/**
 * Module dependencies.
 */
const config = require('../../config');
const logger = require('../../lib/logging').getLogger('lib/auth/index');
const _ = require('lodash');

const mdb = require('../../mongoose');
const bcrypt = require('bcrypt-as-promised');
const acl = require('./acl');
const redis = require('promise-redis')();
const request = require('request-promise');

const redisClient = redis.createClient(config.redis);

const LOGIN_FAILED = 'Authentication failed.';
const Auth = exports.Auth = {};

const svgCaptcha = require('svg-captcha');

// 对hash，进行时限检查，没问题的话就以admin_id登录
Auth.authenticate = async ({ username, password }) => {
  if (username && password) {
    logger.debug('password to login');
    const admin = await mdb.Admin.login(username, password);
    if (admin) {
      return admin;
    }
    throw new Error(LOGIN_FAILED);
  } else {
    logger.debug('no method login');
    throw new Error('验证失败');
  }
};

Auth.load = (parentApp) => {
  parentApp.get('/logout', 'logout', (req, res) => {
    logger.debug('logout');
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(() => {
      res.redirect('/login');
    });
  });

  parentApp.get('/login', 'login', async (req, res) => {
    let backgroundImg;
    try {
      const key = `${config.id}_login_background_img`;
      backgroundImg = await redisClient.get(key);
      if (!backgroundImg) {
        const url = `https://api.unsplash.com/photos/random?client_id=${config.unsplash.app_id}`;
        const results = JSON.parse(await request(url));
        if (results && results.urls && results.urls.raw) {
          backgroundImg = `${results.urls.raw}?w=1080`;
        }

        await redisClient.setex(key, (60), backgroundImg);
      }
    } catch (err) {
      logger.error(err);
    }

    res.render('user/login', {
      title: 'Login',
      layout: 'auth',
      backgroundImg,
    });
  });

  parentApp.post('/login', async (req, res, next) => {
    try {
      if (req.body.captcha !== req.session.captcha) {
        req.session.error = '验证码错误.';
        res.redirect('/login');
        return;
      }

      const user = await mdb.Admin.findOne({username: req.body.username});
      if(user.delete_flag){
        req.session.error = '失效用户.';
        res.redirect('/login');
        return;
      }
      
      const admin = await Auth.authenticate(req.body);
      if (admin) {
        const resources = _.map(config.acl.resources, 'id');
        const permissions = await acl.allowedPermissions(admin.username, resources);
        logger.debug('web login', admin, resources, permissions);

        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(() => {
          // Store the user's primary key
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = admin;
          req.session.permissions = permissions;

          req.session.msg = `
Authenticated as ${admin.username} click to <a href="/logout">logout</a>.
You may now access <a href="${parentApp.locals.url('dashboard.index')}">${parentApp.locals.url('dashboard.index')}</a>.
`;
          res.redirect('/dashboard');
        });
      } else {
        req.session.error = LOGIN_FAILED;
        res.redirect('/login');
      }
    } catch (err) {
      logger.error(err);
      req.session.error = LOGIN_FAILED;
      res.redirect('/login');
    }
  });

  parentApp.post('/captcha', async (req, res, next) => {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      height: 34,
      width: 80,
    });
    req.session.captcha = captcha.text;
    res.json(captcha.data);
  });
};
