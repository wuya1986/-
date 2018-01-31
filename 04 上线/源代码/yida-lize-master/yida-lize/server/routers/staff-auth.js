const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/staff-auth');

const _ = require('lodash');
const moment = require('moment');
const bcrypt = require('bcrypt-as-promised');

const express = require('express');

const mongoose = require('mongoose');
const acl = require('../lib/auth/acl');
const juhe = require('../lib/juhe');
const redis = require('promise-redis')();

const redisClient = redis.createClient(config.redis);
const mdb = require('../mongoose');

const staff_funcs = require('../staff_funcs');

const router = express.Router();

const token_seconds = 60 * 60 * 24 * 7;

const filter = (arrays, permissions) => _.compact(arrays.map((item) => {
  const ps = permissions[item.id];
  if (!ps || ps.indexOf('list') > -1 || ps.indexOf('admin') > -1) {
    return item;
  }
  return null;
}));
const badge = async (staff) => {
  try {
    const messages = await mdb.Message.count({
      readers_admin: {
        $elemMatch: {
          admin: staff._id,
          hasRead: false,
        },
      },
    });
    // 清除app的badge
    const push_badge_key = `${staff.push_device_id}_push_badge`;
    redisClient.set(push_badge_key, messages);

    const ticket_criteria = {
      progress: {
        $ne: '处理完毕',
      },
      $or: [{
        to: {
          $in: [mongoose.Schema.Types.ObjectId(staff._id)],
        },
      }, {
        cc: {
          $in: [mongoose.Schema.Types.ObjectId(staff._id)],
        },
      }],
    };

    return {
      applications: await mdb.Ticket.aggregate([
        {
          $match: {
            progress: {
              $ne: '处理完毕',
            },
          },
        },
        {
          $group: {
            _id: '$ticket_template',
            count: { $sum: 1 },
          },
        },
      ]),
      mine: {
        messages,
        tickets: await mdb.Ticket.count(ticket_criteria),
      },
    };
  } catch (err) {
    logger.error(err);
    return null;
  }
};
const getAuthInfo = async (criteria, token) => {
  let staff = await mdb.Admin.findOne(criteria);
  if (staff) {
    staff = staff.toObject();

    if (!token) {
      token = new Buffer(await bcrypt.hash(staff.username + moment().unix(), config.saltRounds)).toString('base64');
      logger.info('new token', token, staff);
    }
    staff.token = token;

    const resources = _.map(config.acl.resources, 'id');
    const permissions = await acl.allowedPermissions(staff.username, resources);

    staff.permissions = permissions;
    staff.funcs = {
      applications: await applications(permissions),
    };
    staff.badge = await badge(staff);

    redisClient.setex(token, token_seconds, JSON.stringify(staff));
  }

  return staff;
};
const checkFrequency = async (frequency) => {
  const client_request_key = `${config.id}_${frequency}_request`;
  const client_request = await redisClient.get(client_request_key);
  await redisClient.setex(client_request_key, 1, frequency);
  return client_request;
};
// curl -X POST https://admin.yidalize.com/staff-auth/login  -H "Content-Type: application/json" -d '{"username": "6055120@qq.com", "password": "pass"},"push_device_id":"65d045da74de4364a7372f6f768f7b44","push_device_type":"android"}'
// curl -X POST https://admin.yidalize.com/staff-auth/login  -H "Content-Type: application/json" -d '{"token": "JDJhJDEwJGR3YjdvODdTODF1ZW5salpxMW1QaC5oUEh1aDlFcEhhb0plQWtQcDVQdThoTXlJUEtUbk1t"}'
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      // 验证码登录的时候，需要做频次限制，token登录不需要
      const client_request = await checkFrequency(req.headers.uniqueid);
      if (client_request) {
        return res.json({
          success: false,
          msg: '访问太频繁请稍后再访问',
        });
      }

      let staff = await mdb.Admin.login(username, password);
      if (staff) {
        staff = await mdb.Admin.update({
          username,
          delete_flag: false,
        }, {
          push_device_id: req.body.push_device_id,
          push_device_type: req.body.push_device_type,
        });

        staff = await getAuthInfo({
          username,
          delete_flag: false,
        });

        return res.json({
          success: true,
          staff,
        });
      }
      return res.json({
        success: false,
        msg: '此用户不存在',
      });
    }
    const token = req.body.token ? req.body.token : (req.$token ? req.$token : null);
    if (token) {
      let staff = await redisClient.get(token);
      if (staff) {
        staff = JSON.parse(staff);
        // 不用缓存的内容，而是从数据库里面重新取得
        staff = await getAuthInfo({
          _id: staff._id,
        }, token);

        return res.json({
          success: true,
          staff,
        });
      }
      return res.json({
        success: false,
        msg: '用户登录信息过期，请重新登录',
      });
    }
    return res.json({
      success: false,
      msg: '用户名或密码错误',
    });
  } catch (err) {
    logger.error(err);
    return res.json({
      success: false,
      msg: '用户登录出错，请重新登录',
    });
  }
});

// curl https://admin.yidalize.com/staff-auth/logout
router.get('/logout', async (req, res, next) => {
  await redisClient.del(req.$token);
  req.session.destroy();
  res.json({
    success: true,
  });
});

// staff的webview的页面打开
router.get('/webview-login/:token', async (req, res, next) => {
  const { token } = req.params;
  req.session.user = JSON.parse(await redisClient.get(token));
  req.session.permissions = req.session.user.permissions;

  if ((req.session.user && req.session.permissions)) {
    const redirect = req.query.redirect ? req.query.redirect : '/dashboard';
    res.redirect(redirect);
  } else {
    next('用户没有改权限，或者权限已过期，请您重新登录');
  }
});

const randPassword = () => {
  const text = ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '1234567890'];
  const rand = function (min, max) { return Math.floor(Math.max(min, Math.random() * (max + 1))); };
  const len = 8;
  let pw = '';
  for (i = 0; i < len; ++i) {
    const strpos = rand(0, 2);
    pw += text[strpos].charAt(rand(0, text[strpos].length));
  }
  return pw;
};

// curl -X POST https://admin.yidalize.com/staff-auth/password  -H "Content-Type: application/json" -d '{"username": "296096828@qq.com"}'
router.post('/password', async (req, res, next) => {
  try {
    const client_request = await checkFrequency(req.headers.uniqueid);
    if (client_request) {
      res.json({
        success: false,
        msg: '访问太频繁请稍后再访问',
      });
      return;
    }
    const { username } = req.body;
    const staff = await mdb.Admin.findOne({
      username,
      delete_flag: false,
    });
    if (staff) {
      const password = randPassword();
      logger.debug('password', password);
      const hash = await bcrypt.hash(password, config.saltRounds);
      staff.password = hash;
      await mdb.Admin.update({ _id: staff._id }, staff);

      //新密码通过SMS通知用户
      const tpl_id = 57927;
      const results = await juhe.sms(username, tpl_id, `#code#=${password}`);
      logger.info(results, password);

      res.json({
        success: true,
        msg: '新密码已经通过短信发出',
      });
    } else {
      res.json({
        success: false,
        msg: '无效用户',
      });
    }
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: '找回密码出错',
    });
  }
});

// curl -X POST https://admin.yidalize.com/staff-auth/profile  -H "Content-Type: application/json" -d '{"fullname": "zhaolei"}'
router.post('/profile', async (req, res, next) => {
  try {
    const client_request = await checkFrequency(req.headers.uniqueid);
    if (client_request) {
      res.json({
        success: false,
        msg: '访问太频繁请稍后再访问',
      });
      return;
    }
    let staff = await mdb.Admin.update({
      username: req.$staffInfo.username,
      delete_flag: false,
    }, req.body);
    staff = await getAuthInfo({
      username: req.$staffInfo.username,
      delete_flag: false,
    });
    await redisClient.del(req.$token); // 清理旧的token

    res.json({
      success: true,
      staff,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: '用户修改出错',
    });
  }
});

const applications = async (permissions) => {
  const ticket_templates = await mdb.TicketTemplate.find();
  const tickets_applications = [
    {
      id: 309,
      title: '物业服务',
      divider: true,
    },
  ];
  _.map(ticket_templates, (ticket_template) => {
    tickets_applications.push({
      id: ticket_template._id,
      title: ticket_template.title,
      uri: `${config.url}/crud/${ticket_template._id}s`,
      color: '#2ecc71',
    });
  });

  return filter(_.concat(_.cloneDeep(staff_funcs.company_applications), tickets_applications, _.cloneDeep(staff_funcs.admin_applications)), permissions);
};

module.exports = router;
