const config = require('../config');
const logger = require('../lib/logging').getLogger('controllers/crud-company');
const _ = require('lodash');

const mdb = require('../mongoose');
const alipush = require('../lib/alipush');

exports.prefix = '/crud';

exports.name = 'company';

exports.before = async function (req, res, next) {
  const _id = req.params._id;
  if (!_id) return next();
  const company = await mdb.Company.findById(_id);
  if (!company) return next('route');
  req.var_name = company;
  next();
};

exports.index = function (req, res) {
  res.redirect('/crud/companys');
};

exports.list = function (req, res) {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;

  let criteria = {};
  if (keyword) {
    criteria = {
      $or: [{
        company_name: {
          $regex: `.*${keyword}.*`,
        },
      }, {
        lega_person: {
          $regex: `.*${keyword}.*`,
        },
      },
      ],
    };
  }

  logger.debug('criteria', criteria);

  mdb.Company.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.Company.find(criteria)
      .sort('-create_date')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    res.render('crud-company/list', {
      title: '企业列表',
      list,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};

exports.new = function (req, res) {
  res.render('crud-company/new', {
    title: '新建企业',
  });
};

exports.create = async function (req, res) {
  const company = req.body.company;

  if (company) {
    // Create UniquenessCheck 企业名称
    const countCompanyName = await mdb.Company.count({
      company_name: company.company_name,
    });
    if (countCompanyName > 0) {
      req.session.error = '该企业名称已被注册！新建企业失败!';
      return res.redirect('back');
    }
    const Company = new mdb.Company(company);

    // Save
    Company.save((err) => {
      if (err) {
        req.session.error = err.message;
        reponse.redirect('back');
      }

      req.session.msg = '新建企业成功!';
      res.redirect(`/crud/company/${Company._id}`);
    });
  } else {
    res.redirect('/crud/companys');
  }
};

exports.show = async function (req, res, next) {
  const users = await mdb.User.find({ company: req.var_name._id }).sort({ create_date: -1 });
  const meters = await mdb.Meter.find({ company: req.var_name._id }).sort({ _id: 1 });
  res.render('crud-company/show', {
    title: '企业详细',
    data: req.var_name,
    users,
    meters,
  });
};

exports.edit = function (req, res) {
  res.render('crud-company/edit', {
    title: '修改企业',
    data: req.var_name,
  });
};

exports.update = async function (req, res) {
  const _id = req.params._id;
  const company = req.body.company;
  try {
    // Update UniquenessCheck 企业名称
    const countCompanyName = await mdb.Company.count({
      company_name: company.company_name,
      _id: {
        $ne: _id,
      },
    });
    if (countCompanyName > 0) {
      req.session.error = '该企业名称已被注册！修改企业失败!';
      return res.redirect(`/crud/company/${_id}/edit`);
    }
    await mdb.Company.findByIdAndUpdate(_id, company);
    req.session.msg = '修改企业成功!';
    res.redirect(`/crud/company/${_id}`);
  } catch (err) {
    logger.error(err);
    req.session.error = '修改企业失败!';
    res.redirect(`/crud/company/${_id}/edit`);
  }
};

exports.delete = async function (req, res) {
  let result = '';
  // Check 企业下是否存在员工企业下是否存在员工
  const countUser = await mdb.User.count({
    company: req.var_name._id,
  });
  if (countUser > 0) {
    req.session.error = '该企业下还有员工存在！删除企业失败!';
    res.json({ result });
  } else {
    mdb.Company.findOneAndRemove({ _id: req.var_name._id }, (err) => {
      if (err) {
        req.session.error = '删除企业失败!';
        result = err.message;
      } else {
        req.session.msg = '删除企业成功!';
        result = 'Deleted';
      }

      res.json({ result });
    });
  }
};

exports.post_add_company_user = async (req, res) => {
  const user_id = req.body.user_id;
  const company_id = req.body.company_id;
  try {
    const user = await mdb.User.findById(user_id).select('company');
    if (user.company) {
      req.session.error = '该员工已经属于其它企业,如有需要请联系管理人员!';
      res.redirect('back');
    } else {
      await mdb.User.findByIdAndUpdate(user_id, {
        company: company_id,
      }, {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
      });

      res.json({
        success: true,
      });
    }
  } catch (err) {
    logger.error(err);
    req.session.error = '员工添加失败!';
    res.redirect('back');
  }
};

exports.post_remove_company_user = async (req, res) => {
  const user_id = req.query.user_id;
  try {
    await mdb.User.findByIdAndUpdate(user_id, {
      company: null,
    }, {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
};

exports.meter_add = async function (req, res) {
  const company_id = req.query.company_id;
  const company = await mdb.Company.findById(company_id);
  res.render('crud-company/meter_add', {
    title: '新建表号',
    company,
  });
};

exports.post_meter_add = async function (req, res) {
  const meter = req.body;
  try {
    const Meter = new mdb.Meter(meter);

    // Save
    Meter.save((err) => {
      if (err) {
        req.session.error = err.message;
        reponse.redirect('back');
      }

      req.session.msg = '新建表号成功!';
      res.redirect(`/crud/company/${meter.company}`);
    });
  } catch (err) {
    logger.error(err);
  }
};

exports.meter_edit = async function (req, res) {
  const meter_id = req.query.meter_id;
  const meter = await mdb.Meter.findById(meter_id).populate('company');
  res.render('crud-company/meter_edit', {
    title: '修改表号',
    meter,
  });
};

exports.post_meter_edit = async function (req, res) {
  const meter_id = req.query.meter_id;
  const meter = req.body;
  try {
    await mdb.Meter.findByIdAndUpdate(meter_id, meter);
    req.session.msg = '修改表号成功!';
    res.redirect(`/crud/company/${meter.company}`);
  } catch (err) {
    logger.error(err);
  }
};

exports.meter_reading_add = async function (req, res) {
  const meter_id = req.query.meter_id;
  const meter = await mdb.Meter.findById(meter_id).populate('company');
  res.render('crud-company/meter_reading_add', {
    title: '水电煤抄表',
    meter,
  });
};

exports.post_meter_reading_add = async function (req, res) {
  const meter_id = req.query.meter_id;
  const meter_reading = req.body;
  try {
    const meter = await mdb.Meter.findByIdAndUpdate(meter_id, {
      $push: {
        meter_readings: {
          $each: [
            meter_reading,
          ],
          $position: 0,
        },
      },
    }).populate('company');
    await Promise.all(_.map(await mdb.User.find({
      company: meter.company._id,
      role: '授权人',
    }).select('_id'), async (to_user) => {
      const dbMessage = new mdb.Message({
        from_admin: req.session.user._id,
        business_type: 'meter_reading',
        extensions: {
          user_url: '/applications/meter_readings',
        },
        content: '抄表通知: 有新的抄表信息，请您确认一下',
        to_user,
      });
      await dbMessage.save();
      // push message
      await alipush.pushMessage(dbMessage._id);
    }));
    res.redirect(`/crud/company/${meter.company._id}`);
  } catch (err) {
    logger.error(err);
  }
};

exports.meter_reading_edit = async function (req, res) {
  const meter_reading_id = req.query.meter_reading_id;
  const meter = await mdb.Meter.findOne({
    meter_readings: {
      $elemMatch: {
        _id: meter_reading_id,
      },
    },
  }).populate('company');
  const meter_reading = meter.meter_readings.id(meter_reading_id);
  res.render('crud-company/meter_reading_edit', {
    title: '水电煤抄表',
    meter,
    meter_reading,
  });
};

exports.post_meter_reading_edit = async function (req, res) {
  const meter_reading_id = req.query.meter_reading_id;
  const meter_reading = req.body;
  try {
    const meter = await mdb.Meter.findOneAndUpdate({
      meter_readings: {
        $elemMatch: {
          _id: meter_reading_id,
        },
      },
    }, {
      $set: {
        'meter_readings.$': meter_reading,
      },
    }, {
      new: true,
    }).populate('company');
    res.redirect(`/crud/company/${meter.company._id}`);
  } catch (err) {
    logger.error(err);
  }
};
