const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/auth');

const _ = require('lodash');
const moment = require('moment');
const bcrypt = require('bcrypt-as-promised');

const ECard = require('../lib/ecard');

const cms = require('../lib/cms');

const express = require('express');
const redis = require('promise-redis')();

const juhe = require('../lib/juhe');
const alipush = require('../lib/alipush');

const redisClient = redis.createClient(config.redis);
const mdb = require('../mongoose');

const user_funcs = require('../user_funcs');

const router = express.Router();

const token_seconds = 60 * 60 * 24 * 7;
const EMPLOYEE_SELECT = 'fullname avatar mobile_no openid sex dob id_card e_card vpl_number company request_employee role delete_flag push_device_id push_device_type';

const filter = (arrays, role) => _.compact(arrays.map((item) => {
  if (item.roles) {
    if (item.roles.indexOf(role) > -1) {
      //sub node
      if (item.children) {
        item.children = filter(item.children, role);
      }
      return item;
    }
    return null;
  }
  if (item.children) {
    item.children = filter(item.children, role);
  }
  return item;
}));
const notice = async user => await mdb.Message.findOne({
  to_user: user._id,
  hasRead: false,
}).sort('-_id');

const ecard = async (user) => {
  if (!user.e_card) {
    return null;
  }
  try {
    const ecard = new ECard();
    const balance = await ecard.balance(user.e_card);

    return { balance };
  } catch (err) {
    logger.error(err);
    return null;
  }
};

const badge = async (user) => {
  try {
    const messages = await mdb.Message.count({
      to_user: user._id,
      hasRead: false,
    });
    // 清除app的badge
    const push_badge_key = `${user.push_device_id}_push_badge`;
    redisClient.set(`${push_badge_key}`, messsages);

    return {
      main: 0,
      application: 0,
      wallet: 0,
      mine: {
        messages,
        tickets: await mdb.Ticket.count({
          progress: {
            $ne: '处理完毕',
          },
          from_user: user._id,
        }),
      },
    };
  } catch (err) {
    logger.error(err);
    return null;
  }
};
const getAuthInfo = async (criteria, token) => {
  let user = await mdb.User.findOne(criteria)
    .select(EMPLOYEE_SELECT)
    .populate('company');
  if (user) {
    user = user.toObject();

    if (!token) {
      token = new Buffer(await bcrypt.hash(user._id + moment().unix(), config.saltRounds)).toString('base64');
      logger.info('new token', token, user);
    }
    user.token = token;
    user.funcs = {
      notice: await notice(user),
      news: await cms.news(),
      swipers: await cms.swipers(),
      shortcuts: filter(_.cloneDeep(user_funcs.shortcuts), user.role),
      applications: filter(_.cloneDeep(user_funcs.applications), user.role),
      wallet: user_funcs.wallet,
    };
    user.badge = await badge(user);
    user.ecard = await ecard(user);

    redisClient.setex(token, token_seconds, JSON.stringify(user));
  }
  return user;
};
const checkFrequency = async (frequency) => {
  const client_request_key = `${config.id}_${frequency}_request`;
  const client_request = await redisClient.get(client_request_key);
  await redisClient.setex(client_request_key, 1, frequency);
  return client_request;
};

// curl -X POST https://admin.yidalize.com/auth/send_code  -H "Content-Type: application/json" -d '{"mobile_no":"18624357886"}'
router.post('/send_code', async (req, res, next) => {
  const client_request = await checkFrequency(req.headers.uniqueid);
  if (client_request) {
    res.json({
      success: false,
      msg: '访问太频繁请稍后再访问',
    });
    return;
  }
  const { mobile_no } = req.body;
  const user = await getAuthInfo({
    mobile_no,
    delete_flag: false,
  });
  if (!user) {
    return res.json({
      success: false,
      msg: '无效用户或用户不存在',
    });
  }

  const randomIntInc = (low, high) => Math.floor(Math.random() * (high - low + 1) + low);
  const rand = randomIntInc(1000, 9999);

  const tpl_id = 55504;
  const results = await juhe.sms(mobile_no, tpl_id, `#code#=${rand}`);
  logger.info(results, rand);

  await redisClient.setex(`${config.id}_${mobile_no}_verify_code`, (60 * 60), rand);

  res.json({
    success: results.error_code === 0,
    msg: results.reason,
  });
});

// curl -X POST https://admin.yidalize.com/auth/verify_code/ -H "Content-Type: application/json" -d '{ "mobile_no":"18624357886", "code": "8367"}'  -H "Authorization: Bearer oyp5_v_BcOum3SdbfMd82S0XdKBw"
router.post('/verify_code', async (req, res, next) => {
  const { mobile_no, code } = req.body;

  const rand = await redisClient.get(`${config.id}_${mobile_no}_verify_code`);
  if (rand === code) {
    //check user
    const check_user = await mdb.User.findOne({
      mobile_no,
      openid: {
        $ne: req.$token,
      },
    });
    if (check_user) {
      const user = await mdb.User.findOne({ openid: req.$token });
      await mdb.User.update({
        _id: check_user._id,
      }, {
        openid: user.openid,
        avatar: user.avatar,
      });
      await mdb.User.remove({ _id: user._id });
    } else {
      await mdb.User.update({
        openid: req.$token,
      }, {
        mobile_no,
        $push: {
          events: {
            $each: [{
              content: `绑定电话${mobile_no}`,
            }],
            $position: 0,
          },
        },
      });
    }
  }
  await redisClient.del(req.$token);

  res.json({
    success: rand === code,
  });
});

// curl -X POST https://admin.yidalize.com/auth/login  -H "Content-Type: application/json" -d '{"mobile_no":"18624357886","verify_code":"3197","error":"","push_device_id":"65d045da74de4364a7372f6f768f7b44","push_device_type":"android"}'
// curl -X POST https://admin.yidalize.com/auth/login  -H "Content-Type: application/json" -d '{"token": "oyp5_v_BcOum3SdbfMd82S0XdKBw"}'
router.post('/login', async (req, res, next) => {
  try {
    const { mobile_no, verify_code } = req.body;
    if (mobile_no && verify_code) {
      // 验证码登录的时候，需要做频次限制，token登录不需要
      const client_request = await checkFrequency(req.headers.uniqueid);
      if (client_request) {
        return res.json({
          success: false,
          msg: '访问太频繁请稍后再访问',
        });
      }

      if (verify_code !== '20171225') { //苹果审核用固定验证码:20171225
        const rand = await redisClient.get(`${config.id}_${mobile_no}_verify_code`);
        if (rand !== verify_code) {
          return res.json({
            success: false,
            msg: '验证码错误',
          });
        }
      }
      // 无需signup，只要证明这个电话号码所有人即可， fullname可以事后修改
      await mdb.User.update({
        mobile_no,
        delete_flag: false,
      }, req.body);
      user = await getAuthInfo({
        mobile_no,
        delete_flag: false,
      });
      logger.info('user', user);

      if (user) {
        return res.json({
          success: true,
          user,
        });
      }
      return res.json({
        success: false,
        msg: '无效用户或用户不存在',
      });
    }
    const token = req.body.token ? req.body.token : (req.$token ? req.$token : null);

    if (token) {
      let user = await redisClient.get(token);
      if (user) {
        user = JSON.parse(user);
        // 不用缓存的内容，而是从数据库里面重新取得
        user = await getAuthInfo({
          _id: user._id,
          delete_flag: false,
        }, token);

        return res.json({
          success: true,
          user,
        });
      }
      // check if wx openid
      user = await getAuthInfo({
        openid: token,
        delete_flag: false,
      }, token);
      if (user) {
        logger.info('user2', user);
        return res.json({
          success: true,
          user,
        });
      }

      return res.json({
        success: false,
        msg: '无效账户或者用户登录信息过期，请重新登录',
      });
    }
    return res.json({
      success: false,
      msg: '用户名或验证码错误',
    });
  } catch (err) {
    logger.error(err);
    return res.json({
      success: false,
      msg: '用户登录出错，请重新登录',
    });
  }
});

// curl http://127.0.0.1:3000/auth/logout -H "Authorization: Bearer JDJhJDEwJDA1WnpFTFgvbnlKR3JqbFp5VmI5d3VsNHRUdHN6YWZmRENpN2t3SjJJU08vWkVBQk9rR1JL"
router.get('/logout', async (req, res, next) => {
  await redisClient.del(req.$token);
  res.json({
    success: true,
  });
});

router.get('/userinfo', async (req, res, next) => {
  if (req.$userInfo) {
    const user = req.$userInfo;
    user.token = req.$token;
    return res.json({
      success: true,
      user,
    });
  }
  res.json({
    success: false,
    msg: '无效用户',
  });
});

// curl -X POST https://admin.yidalize.com/auth/userinfo  -H "Content-Type: application/json" -d '{"push_device_id": "134787878786urtyu567", "push_device_type": "134787878786urtyu567"}'
router.post('/userinfo', async (req, res, next) => {
  try {
    const client_request = await checkFrequency(req.headers.uniqueid);
    if (client_request) {
      res.json({
        success: false,
        msg: '访问太频繁请稍后再访问',
      });
      return;
    }
    let user = await mdb.User.update({
      mobile_no: req.$userInfo.mobile_no,
      delete_flag: false,
    }, req.body);
    user = await getAuthInfo({
      mobile_no: req.$userInfo.mobile_no,
      delete_flag: false,
    });
    await redisClient.del(req.$token); // 清理旧的token

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: '用户修改出错',
    });
  }
});

// user端 申请认证
// 新卡注册申请
//curl -X POST https://admin.yidalize.com/auth/certification  -H "Content-Type: application/json" -H "Authorization: Bearer JDJhJDEwJFBZMm1NRW1vcTdQOW9CT0t0b000Ti40WE9pbnAuRWFzLmFocWtKVUtFVHdybWhBYk9sbndT" -d '{"company_name":"测试企业","fullname":"赵磊"}'
router.post('/certification', async (req, res, next) => {
  try {
    const client_request = await checkFrequency(req.headers.uniqueid);
    if (client_request) {
      res.json({
        success: false,
        msg: '访问太频繁请稍后再访问',
      });
      return;
    }

    const { company_name, fullname } = req.body;
    logger.error(company_name, fullname);
    if (company_name) {
      const company = await mdb.Company.findOne({ company_name });
      if (company) {
        let user = await mdb.User.update({
          mobile_no: req.$userInfo.mobile_no,
          delete_flag: false,
        }, _.assign(req.body, {
          company,
          request_employee: '申请',
        }));

        user = await getAuthInfo({
          mobile_no: req.$userInfo.mobile_no,
          delete_flag: false,
        });
        await redisClient.del(req.$token); // 清理旧的token

        res.json({
          success: true,
          user,
        });

        // create a new message to 授权人
        await Promise.all(_.map(await mdb.User.find({
          company: company._id,
          role: '授权人',
        }).select('_id'), async (to_user) => {
          const dbMessage = new mdb.Message({
            from_user: req.$userInfo._id,
            content: `${req.body.fullname} (${req.body.company_name}) 提交验证申请`,
            to_user,
          });

          await dbMessage.save();
          // push message
          alipush.pushMessage(dbMessage._id);
        }));
      } else {
        res.json({
          success: false,
          msg: '很抱歉，找不到该企业',
        });
      }
    } else {
      res.json({
        success: false,
        msg: '参数错误',
      });
    }
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

module.exports = router;
