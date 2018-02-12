const config = require('../config');
const logger = require('../lib/logging').getLogger('controllers/crud-admin');

const mdb = require('../mongoose');
const acl = require('../lib/auth/acl');

const bcrypt = require('bcrypt-as-promised');

exports.prefix = '/crud';

exports.name = 'admin';

exports.engine = 'handlebars';

exports.before = async function (req, res, next) {
  const _id = req.params._id;
  if (!_id) return next();
  const admin = await mdb.Admin.findById(_id)
    .populate('user', 'fullname avatar');
  if (!admin) return next('route');
  req.var_name = admin;
  next();
};

exports.index = function (req, res) {
  res.redirect('/crud/admins');
};

exports.list = function (req, res) {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;

  let criteria = {};
  if (keyword) {
    criteria = {
      $or: [{
        username: {
          $regex: `.*${keyword}.*`,
        },
      }, {
        fullname: {
          $regex: `.*${keyword}.*`,
        },
      },
      ],
    };
  }
  logger.debug('criteria', criteria);

  mdb.Admin.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.Admin.find(criteria)
      .populate('user', 'fullname avatar')
      .sort('-_id')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    res.render('crud-admin/list', {
      title: 'List Admins',
      list,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};

exports.new = function (req, res) {
  res.render('crud-admin/new', {
    title: 'New Admin',
  });
};

exports.create = async function (req, res) {
  const admin = req.body.admin;

  try {
    if (admin) {
      // password
      if (admin.password) {
        const hash = await bcrypt.hash(admin.password, config.saltRounds);
        admin.password = hash;
      } else {
        delete admin.password;
      }

      const Admin = new mdb.Admin(admin);
      // Save
      await Admin.save();
      req.session.msg = 'Admin创建成功!';
      res.redirect(`/crud/admin/${Admin._id}`);

      // role
      acl.setUserRoles(Admin.username, admin.acl_roles);
    } else {
      res.redirect('/crud/admins');
    }
  } catch (err) {
    logger.error(err);
    req.session.error = err.message;
    res.redirect('back');
  }
};

exports.show = function (req, res) {
  res.render('crud-admin/show', {
    title: 'Show Admin',
    data: req.var_name,
  });
};

exports.edit = function (req, res) {
  res.render('crud-admin/edit', {
    title: 'Edit Admin',
    data: req.var_name,
  });
};

exports.update = async function (req, res) {
  const admin = req.body.admin;
  // password
  if (admin.password) {
    const hash = await bcrypt.hash(admin.password, config.saltRounds);
    admin.password = hash;
  } else {
    delete admin.password;
  }

  mdb.Admin.findOneAndUpdate({ _id: req.var_name._id }, admin, (err) => {
    if (err) {
      req.session.error = 'Error updating delete admin!';
      res.redirect(`/crud/admin/${req.var_name._id}/edit`);
    } else {
      req.session.msg = 'Admin updated succesfuly!';
      res.redirect(`/crud/admin/${req.var_name._id}`);
    }
  });

  // role
  acl.setUserRoles(admin.username, admin.acl_roles);
};

exports.delete = async function (req, res) {
  let result = '';
  const countTicket = await mdb.Ticket.count({ cc: req.var_name._id });
  if (countTicket > 0) {
    req.session.msg = '参与事件并未删除！删除失败!';
    res.json({ result });
  } else {
    mdb.Admin.findOneAndRemove({ _id: req.var_name._id }, (err) => {
      if (err) {
        req.session.error = 'Error trying delete admin!';
        result = err.message;
      } else {
        req.session.msg = 'Admin deleted succesfuly!';
        result = 'Deleted';
      }

      res.json({ result });
    });
  }
};

exports.admins_json = (req, res) => {
  const keyword = req.query.keyword;
  const page = req.query.page ? req.query.page : 1;

  const criteria = {
    $or: [{
      username: {
        $regex: `.*${keyword}.*`,
      },
    }, {
      fullname: {
        $regex: `.*${keyword}.*`,
      },
    },
    ],
  };

  logger.debug('criteria', criteria);

  mdb.Admin.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const admins = await mdb.Admin.find(criteria).sort('-_id')
      .skip((page - 1) * config.pageSize).limit(config.pageSize);
    //
    res.json({
      models: admins,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};
