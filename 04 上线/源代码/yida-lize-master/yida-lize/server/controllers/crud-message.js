const config = require('../config');
const logger = require('../lib/logging').getLogger('controllers/message');

const _ = require('lodash');
const util = require('util');

const alipush = require('../lib/alipush');

const nws = require('../lib/wxsettings').nws;
const QRCode = require('../lib/qrcode');

const qrcode = new QRCode();

const mdb = require('../mongoose');
const redis = require('promise-redis')();

const redisClient = redis.createClient(config.redis);

exports.prefix = '/crud';

exports.name = 'message';

exports.index = (req, res) => {
  res.redirect('/crud/messages');
};

exports.list = (req, res) => {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;

  let criteria = {};
  if (keyword) {
    criteria = {
      content: {
        $regex: `.*${keyword}.*`,
      },
    };
  }

  logger.debug('criteria', criteria);

  mdb.Message.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.Message
      .find(criteria)
      .populate('from_user', 'fullname avatar')
      .populate('from_admin', 'fullname avatar')
      .populate('to_user', 'fullname avatar')
      .populate('to_admin', 'fullname avatar')
      .populate('business_type', 'title')
      .sort('-_id')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    //
    res.render('crud-message/list', {
      title: 'List 消息',
      list,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};
exports.new = async (req, res) => {
  let to_admin;
  if (req.query.to_admin_id) {
    to_admin = await mdb.Admin.findById(req.query.to_admin_id).select('fullname');
  }
  let to_user;
  if (req.query.to_user_id) {
    to_user = await mdb.User.findById(req.query.to_user_id).select('fullname');
  }
  let to_company;
  if (req.query.to_company_id) {
    to_company = await mdb.Company.findById(req.query.to_company_id).select('company_name');
  }

  res.render('crud-message/new', {
    title: 'New Message',
    to_admin,
    to_user,
    to_company,
  });
};

exports.create = async (req, res, next) => {
  const message = req.body.message;

  if (message) {
    message.from_admin = req.session.user._id;
    try {
      if (message.roles) {
        message.roles = _.concat([], message.roles); // message.roles有可能不是数组
      }
      let m = _.cloneDeep(message);
      // merge message.roles to admins
      await Promise.all(_.map(_.uniq(_.concat(_.flattenDeep(await Promise.all(_.map(message.roles, async (role) => {
        const admins = await mdb.Admin.find({
          acl_roles: {
            $in: [role],
          },
        }).select('_id');
        return _.map(admins, admin => admin.id.toString());
      }))), message.admins ? message.admins : [])), async (to_admin) => {
        // save to mongo
        m.to_admin = to_admin;
        const dbMessage = new mdb.Message(m);
        await dbMessage.save();

        await alipush.pushMessage(dbMessage._id);
      }));

      if (message.companys) {
        message.companys = _.concat([], message.companys);
      }
      m = _.cloneDeep(message);
      await Promise.all(_.map(_.uniq(_.concat(_.flattenDeep(await Promise.all(_.map(message.companys, async (company) => {
        const users = await mdb.User.find({
          company,
          role: '授权人',
        }).select('_id');
        return _.map(users, user => user.id.toString());
      }))), message.users ? message.users : [])), async (to_user) => {
        // save to mongo
        m.to_user = to_user;
        const dbMessage = new mdb.Message(m);
        await dbMessage.save();

        await alipush.pushMessage(dbMessage._id);
      }));


      req.session.msg = '通知新建成功!';
      res.redirect('/crud/messages');
    } catch (err) {
      logger.error(err);
      req.session.error = '新建失败通知!';
      res.redirect('back');
    }
  } else {
    res.redirect('/crud/messages');
  }
};

exports.chat = async (req, res) => {
  if (!req.query.from_admin_id && !req.query.from_user_id) {
    req.session.error = '没有指定消息的发送者';
    return res.redirect('back');
  }

  if (!req.query.to_admin_id && !req.query.to_user_id) {
    req.session.error = '没有指定消息的接收者';
    return res.redirect('back');
  }

  try {
    const criteria1 = {};
    const criteria2 = {};
    let from_admin;
    if (req.query.from_admin_id) {
      from_admin = await mdb.Admin.findById(req.query.from_admin_id).select('fullname avatar');
      criteria1.from_admin = req.query.from_admin_id;
      criteria2.to_admin = req.query.from_admin_id;
    }
    let from_user;
    if (req.query.from_user_id) {
      from_user = await mdb.User.findById(req.query.from_user_id).select('fullname avatar');
      criteria1.from_user = req.query.from_user_id;
      criteria2.to_user = req.query.from_user_id;
    }
    let to_admin;
    if (req.query.to_admin_id) {
      to_admin = await mdb.Admin.findById(req.query.to_admin_id).select('fullname avatar');
      criteria1.to_admin = req.query.to_admin_id;
      criteria2.from_admin = req.query.to_admin_id;
    }
    let to_user;
    if (req.query.to_user_id) {
      to_user = await mdb.User.findById(req.query.to_user_id).select('fullname avatar');
      criteria1.to_user = req.query.to_user_id;
      criteria2.from_user = req.query.to_user_id;
    }

    if (req.session.user._id === req.query.from_admin_id) {
      // hasRead
      await mdb.Message.update(criteria1, {
        hasRead: true,
      }, {
        multi: true,
      });
    }

    const criteria = {
      $or: [criteria1, criteria2],
    };
    let ticket_template;
    if (req.query.business_type) {
      criteria.business_type = req.query.business_type;
      ticket_template = await mdb.TicketTemplate.findById(req.query.business_type).select('title');
    }
    let messages = await mdb.Message.find(criteria)
      .populate('from_user', 'fullname avatar')
      .populate('from_admin', 'fullname avatar')
      .populate('to_user', 'fullname avatar')
      .populate('to_admin', 'fullname avatar')
      .sort('-_id')
      .limit(config.pageSize);
    messages = _.sortBy(_.map(messages, (m) => {
      m = m.toObject();
      if (m.from_user && from_user && m.from_user._id.equals(from_user._id)) {
        m.right = true;
      }
      if (m.from_admin && from_admin && m.from_admin._id.equals(from_admin._id)) {
        m.right = true;
      }
      return m;
    }), ['_id']);

    res.render('crud-message/show', {
      title: 'Show Message',
      messages,
      from_admin,
      from_user,
      to_admin,
      to_user,
      ticket_template,
    });
  } catch (err) {
    logger.error(err);
    req.session.error = '参数错误';
    return res.redirect('back');
  }
};

exports.delete = (req, res) => {
  let result = '';
  logger.debug('delete:', req.var_name._id);

  mdb.Message.remove({
    _id: req.var_name._id,
  }).then(() => {
    req.session.msg = '消息删除成功!';
    result = 'Deleted';

    res.json({
      success: true,
      result,
    });
  }).catch((err) => {
    logger.error(err);
    req.session.error = '删除失败消息!';
    result = err.message;
    res.json({
      success: false,
      result,
    });
  });
};

exports.my_messages = (req, res) => {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;

  let criteria = {
    $or: [{
      to_admin: req.session.user._id,
    }],
  };
  if (keyword) {
    criteria = _.assign(criteria, {
      $or: [{
        content: {
          $regex: `.*${keyword}.*`,
        },
      }],
    });
  }
  logger.debug('criteria', criteria);

  mdb.Message.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.Message
      .find(criteria)
      .populate('from_admin', 'fullname avatar')
      .populate('from_user', 'fullname avatar')
      .populate('to_admin', 'fullname avatar')
      .populate('to_user', 'fullname avatar')
      .populate('business_type', 'title')
      .sort('-_id')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    //
    res.render('crud-message/my_messages', {
      title: '我的消息',
      list,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};

// 发送消息
exports.post_resend_message = async function (req, res) {
  alipush.pushMessage(req.query.message_id);

  res.json({
    success: true,
  });
};

exports.post_send_message = async (req, res, next) => {
  const message = req.body;

  if (message) {
    message.from_admin = req.session.user._id;
    try {
      if (message.business_type) {
        const ticket_template = await mdb.TicketTemplate.findById(message.business_type).select('title');
        message.content = `${ticket_template.title}：${message.content}`;
      }
      // save to mongo
      const dbMessage = new mdb.Message(message);
      await dbMessage.save();

      alipush.pushMessage(dbMessage._id);

      res.json({
        success: true,
        message,
      });
    } catch (err) {
      logger.error(err);
      res.json({
        success: true,
        msg: '新建失败消息!',
      });
    }
  } else {
    res.json({
      success: true,
      msg: '消息为空',
    });
  }
};

