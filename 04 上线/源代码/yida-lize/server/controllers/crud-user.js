const config = require('../config');
const logger = require('../lib/logging').getLogger('controllers/crud-user');

const mdb = require('../mongoose');
const moment = require('moment');
const _ = require('lodash');
const bcrypt = require('bcrypt-as-promised');
const alipush = require('../lib/alipush');

exports.prefix = '/crud';

exports.name = 'user';

exports.before = async function (req, res, next) {
  const _id = req.params._id;
  if (!_id) return next();
  let user = await mdb.User.findById(_id).populate('company');
  if (user) { user = user.toObject(); } else { return next('route'); }

  // tickets
  user.tickets = await mdb.Ticket.find({
    from_user: _id,
  }).populate('ticket_template', 'title').sort({
    _id: -1,
  }).limit(config.pageSize);

  // userpays
  user.userpays = await mdb.UserPay.find({
    user: _id,
  }).sort({
    _id: -1,
  }).limit(config.pageSize);

  req.var_name = user;
  next();
};

exports.index = function (req, res) {
  res.redirect('/crud/users');
};

exports.list = function (req, res) {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;
  const boolean = new Boolean(true);

  let criteria = {};
  if (keyword) {
    // 性别检索
    if (keyword === '男') {
      criteria = {
        sex: 1,
      };
    } else if (keyword === '女') {
      criteria = {
        sex: 2,
      };
    } else if (keyword.indexOf(':') > 0) {
      const keys = keyword.split(':');
      criteria[keys[0]] = keys[1];
    } else {
      criteria = {
        $or: [{
          fullname: {
            $regex: `.*${keyword}.*`,
          },
        }, {
          mobile_no: {
            $regex: `.*${keyword}.*`,
          },
        }, {
          id_card: {
            $regex: `.*${keyword}.*`,
          },
        }, {
          e_card: {
            $regex: `.*${keyword}.*`,
          },
        }, {
          role: {
            $regex: `.*${keyword}.*`,
          },
        }],
      };
    }
  }

  logger.debug('criteria', criteria);

  mdb.User.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.User.find(criteria)
      .populate('company')
      .sort('-create_date')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    res.render('crud-user/list', {
      title: '企业员工一览',
      list,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};

exports.new = function (req, res) {
  res.render('crud-user/new', {
    title: '新建企业员工',
  });
};

exports.post_uniqueness_check = async (req, res) => {
  const phone = req.body.mobile_no;
  const idCard = req.body.id_card;
  const eCard = req.body.e_card;
  const vpl = req.body.vpl_number;
  const id = req.body.user_id;
  try {
    if (phone) {
      // UniquenessCheck 电话号码
      const countMobileNo = await mdb.User.count({
        mobile_no: phone,
        _id: {
          $ne: id,
        },
      });
      // UniquenessCheck 身份证号
      let countIdCard = '0';
      if (idCard) {
        countIdCard = await mdb.User.count({
          id_card: idCard,
          _id: {
            $ne: id,
          },
        });
      }
      // UniquenessCheck 一卡通号码
      let countECard = '0';
      if (eCard) {
        countECard = await mdb.User.count({
          e_card: eCard,
          _id: {
            $ne: id,
          },
        });
      }
      // UniquenessCheck 车牌号
      let countVpl = '0';
      if (vpl) {
        countVpl = await mdb.User.count({
          vpl_number: vpl,
          _id: {
            $ne: id,
          },
        });
      }
      res.json({
        eCard: countECard,
        vpl: countVpl,
        phone: countMobileNo,
        idCard: countIdCard,
      });
    } else {
      res.json({
        success: true,
      });
    }
  } catch (err) {
    logger.error(err);
    req.session.error = '操作失败!';
    return res.redirect('back');
  }
};

exports.create = async (req, res) => {
  const user = req.body.user;

  if (user) {
    if(user.id_card){
      user.dob = moment(user.id_card.substring(6, 14), 'YYYYMMDD').format('YYYY-MM-DD');
    }
    try {
      const User = new mdb.User(user);

      // Save
      User.save((err) => {
        if (err) {
          req.session.error = err.message;
          res.redirect('back');
        }

        req.session.msg = '新建企业员工成功!';
        res.redirect(`/crud/user/${User._id}`);
      });
    } catch (err) {
      logger.error(err);
      req.session.error = '新建企业员工失败!';
      res.redirect('back');
    }
  } else {
    res.redirect('/crud/users');
  }
};

exports.show = async function (req, res, next) {
  res.render('crud-user/show', {
    title: '企业员工详细',
    data: req.var_name,
  });
};

exports.edit = function (req, res) {
  const user = req.var_name;
  if(user.id_card){
    user.dob = moment(user.id_card.substring(6, 14), 'YYYYMMDD').format('YYYY-MM-DD');
  }
  res.render('crud-user/edit', {
    title: '修改企业员工',
    data: req.var_name,
  });
};
exports.update = async function (req, res) {
  const _id = req.params._id;
  const user = req.body.user;
  try {
    if (user.role === '访客') {
      user.company = null;
    }
    if(user.id_card){
      user.dob = moment(user.id_card.substring(6, 14), 'YYYYMMDD').format('YYYY-MM-DD');
    }
    const content = `${req.session.user.username} 修改了:${JSON.stringify(user)}`;
    const oldUser = await mdb.User.findByIdAndUpdate(_id, _.assign({
      $push: {
        events: {
          $each: [{
            content,
          }],
          $position: 0,
        },
      },
    }, user));
    req.session.msg = '修改企业员工成功!';
    res.redirect(`/crud/user/${_id}`);

    // push
    if (oldUser.e_card !== user.e_card && user.e_card) {
      // 您的一卡通已经准备好，请到物业来领取
      const ecardMessage = new mdb.Message({
        from_admin: req.session.user._id,
        content: `您的一卡通已经准备好，卡号${user.e_card}，请到物业来领取`,
        to_user: oldUser,
      });
      await ecardMessage.save();
      // push message
      alipush.pushMessage(ecardMessage._id);
    } else {
      // 修改了某个员工，需要通知给“授权人”和这个员工通知一声
      await Promise.all(_.concat(oldUser._id, _.map(_.map(await mdb.User.find({
        company: oldUser.company,
        role: '授权人',
      }).select('_id'), async (to_user) => {
        const dbMessage = new mdb.Message({
          from_admin: req.session.user._id,
          content: `服务中心修改了 ${oldUser.fullname}的相关信息`,
          to_user,
        });
        await dbMessage.save();
        // push message
        alipush.pushMessage(dbMessage._id);
      }))));
    }
  } catch (err) {
    logger.error(err);
    req.session.error = '修改企业员工失败!';
    res.redirect(`/crud/user/${_id}/edit`);
  }
};

exports.delete = async function (req, res) {
  let result = '';
  const countTicket = await mdb.Ticket.count({ from_user: req.var_name._id });
  if (countTicket > 0) {
    req.session.msg = '员工参与事件未删除！删除企业员工失败!';
    res.json({ result });
  } else {
    mdb.User.findOneAndRemove({ _id: req.var_name._id }, (err) => {
      if (err) {
        req.session.error = '删除企业员工失败!';
        result = err.message;
      } else {
        req.session.msg = '删除企业员工成功!';
        result = 'Deleted';
      }
      res.json({ result });
    });
  }
};
