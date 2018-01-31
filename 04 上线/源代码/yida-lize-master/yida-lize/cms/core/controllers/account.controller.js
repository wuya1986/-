var bcrypt = require('bcrypt');
var logger = require('../../lib/logger.lib');
var sha1 = require('../services/sha1.service');
var usersService = require('../services/users.service');
// var captcha = require('../../lib/captcha.lib');

const svgCaptcha = require('svg-captcha');

/**
 * 检查是否登陆
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.check = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({
      error: {
	code: 'NOT_LOGGED_IN',
	message: '没有登录'
      }
    });
  }
};

/**
 * 登陆
 * @param {Object} req
 * 				{String} req.body.username
 * 				{String} req.body.password
 * @param {Function} res
 */
exports.signIn = function (req, res) {
  req.checkBody({
    'username': {
      notEmpty: {
	options: [true],
	errorMessage: 'username 不能为空'
      },
      isEmail: { errorMessage: 'username 格式不正确' }
    },
    'password': {
      notEmpty: {
	options: [true],
	errorMessage: 'password 不能为空'
      },
    },
    'autoSignIn': {
      notEmpty: {
	options: [true],
	errorMessage: 'autoSignIn 不能为空'
      },
      isBoolean: { errorMessage: 'autoSignIn 需为布尔值' }
    },
    'captchaCode': {
      notEmpty: {
        options: [true],
        errorMessage: 'captchaCode 不能为空'
      },
    }
  });

  var username = req.body.username;
  var password = req.body.password;
  var autoSignIn = req.body.autoSignIn;
  var captcha = req.body.captchaCode;

  if (captcha !== req.session.captcha) {
    logger.system().error(__filename, '验证码错误', req.validationErrors());
    return res.status(400).end();
  }

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(400).end();
  }

  usersService.one({
     username: username
    }, function (err, user) {
    if (err) {
      logger[err.type]().error(__filename, err);
      return res.status(500).end();
    }

    console.log("~~~~~~~~~~~~~~");
    console.log(user);

    if (user && user.acl_roles.indexOf('content_manager') !== -1) {
      bcrypt.compare(password, user.password, function(err, result) {
        console.log(err, result);
        if (err || !result) {
          res.status(401).json({
            error: {
              code: 'WRONG_USERNAME_OR_PASSWORD',
              message: '密码错误'
            }
          });
        } else {
          req.session.user = user;
          if (autoSignIn) req.session.cookie.maxAge = 60 * 1000 * 60 * 24 * 90;

          res.status(204).end();
        }
      });

    } else {
      res.status(401).json({
        error: {
          code: 'WRONG_USERNAME_OR_PASSWORD',
          message: '用户名或密码错误'
        }
      });
    }
  });
};

/**
 * 注销登陆
 * @param {Object} req
 * @param {Object} res
 */
exports.signOut = function (req, res) {
  req.session.destroy(function(err) {
    if (err) {
      logger.system().error(__filename, err);
      return res.status(500).end();
    }

    res.status(204).end();
  });
};

/**
 * 查询当前账号
 * @param {Object} req
 * @param {Object} res
 */
exports.current = function (req, res) {
  if (req.session.user) {
    usersService.one({ _id: req.session.user._id }, function (err, user) {
      if (err) {
	logger.database().error(__filename, err);
	return res.status(400).end();
      }

      res.status(200).json(user);
    });
  } else {
    res.status(401).json({
      error: {
	code: 'NOT_LOGGED_IN',
	message: '没有登录'
      }
    });
  }
};

exports.captcha = function (req, res) {
	const captcha = svgCaptcha.create({
		size: 4,
		noise: 2,
		height: 34,
		width: 80,
	  });
	req.session.captcha = captcha.text;
	res.json(captcha.data);
}
