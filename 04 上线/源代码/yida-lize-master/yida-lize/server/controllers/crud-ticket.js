const config = require('../config');
const logger = require('../lib/logging').getLogger('controllers/ticket');

const _ = require('lodash');
const util = require('util');

const alipush = require('../lib/alipush');

const nws = require('../lib/wxsettings').nws;
const QRCode = require('../lib/qrcode');
const exportXlsx = require('../lib/export_xlsx');
const ticket_indicates = require('../ticket_indicates');

const qrcode = new QRCode();

const mdb = require('../mongoose');

const prefix = exports.prefix = '/crud';

exports.name = [
  'guest_visit',
  'batchly_visitor',
  'completed_acceptance_check',
  'deposit_refund',
  'decoration_application',
  'goods_letin',
  'goods_letout',
  'hide_acceptance_check',
  'individual_visitor',
  'office_handover',
  'property_repair',
  'reserve_visit',
  'settle_in',
  'settle_out',
  'complaint_advice',
  'parking_apply',
];

exports.before = (req, res, next) => {
  const id = req.params._id;
  if (!id) {
    next();
    return;
  }
  mdb.Ticket.findById(id)
    .populate('company ticket_template')
    .populate('from_user', 'fullname avatar')
    .populate('from_admin', 'fullname avatar')
    .populate('to', 'fullname avatar')
    .populate('comments.admin', 'fullname avatar')
    .then((ticket) => {
      if (!ticket) {
        next('route');
        return;
      }
      req.var_name = ticket;
      next();
    })
    .catch((err) => {
      logger.error('err:', err);
      next();
    });
};

const getTemplateId = originalUrl => _.split(originalUrl, /[\/\?]/)[2];
exports.list = async (req, res) => {
  const { keyword } = req.query;

  let template_id = getTemplateId(req.originalUrl);
  template_id = template_id.substring(0, template_id.length - 1); // 去掉's'
  const ticketTemplate = await mdb.TicketTemplate.findById(template_id);

  const page = req.query.page ? req.query.page : 1;

  let criteria = {};
  if (keyword) {
    criteria = {
      $or: [{
        progress: {
          $regex: `.*${keyword}.*`,
        },
      }, {
        content: {
          $regex: `.*${keyword}.*`,
        },
      }],
    };
  }
  criteria.ticket_template = template_id;
  logger.debug('criteria', criteria);

  mdb.Ticket.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.Ticket
      .find(criteria)
      .populate('company from_user from_admin ticket_template')
      .sort('-_id')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    //
    res.render('crud-ticket/list', {
      title: 'List 工作票',
      list,
      pagination,
      ticketTemplate,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};

exports.new = async (req, res) => {
  const template_id = getTemplateId(req.originalUrl);
  const ticketTemplate = await mdb.TicketTemplate.findById(template_id);
  res.render('crud-ticket/new', {
    title: 'New Ticket',
    ticketTemplate,
  });
};

exports.create = async (req, res, next) => {
  const ticket = req.body.ticket;

  if (ticket) {
    try {
      if (ticket.company) {
        ticket.from_user = (await mdb.User.findOne({
          company: ticket.company,
          delete_flag: false,
          role: '授权人',
        }).select('_id'))._id;

        ticket.form_data = await mdb.Company.findById(ticket.company).select('company_name floor number');
      }
      ticket.to = [req.session.user._id];
      // save to mongo
      const dbTicket = new mdb.Ticket(ticket);
      await dbTicket.save();

      alipush.pushTicket(dbTicket._id);
      req.session.msg = '工作票新建成功!';
      res.redirect(`/crud/${dbTicket.ticket_template}/${dbTicket._id}`);
    } catch (err) {
      logger.error(err);
      req.session.error = '新建失败工作票!';
      res.redirect('back');
    }
  } else {
    res.redirect(`/crud/${dbTicket.ticket_template}s`);
  }
};

exports.show = async (req, res) => {
  const data = req.var_name;
  const admins = await mdb.Admin.find({
    acl_roles: {
      $in: ['repair_team'],
    },
  }).select('_id, fullname');

  const ticket_template_id = data.ticket_template._id;
  logger.debug("ticket_template_id", ticket_template_id);
  logger.debug("ticket_indicates", ticket_indicates[ticket_template_id]);

  res.render('crud-ticket/show', {
    title: 'Show Ticket',
    data,
    admins,
    form_file: () => data.ticket_template.form_file,
    ticket_indicates: ticket_indicates[ticket_template_id],
  });
};
exports.edit = async (req, res) => {
  const template_id = getTemplateId(req.originalUrl);
  const ticketTemplate = await mdb.TicketTemplate.findById(template_id);
  res.render('crud-ticket/edit', {
    title: '修改工作票',
    data: req.var_name,
    ticketTemplate,
  });
};

exports.update = async function (req, res) {
  const _id = req.params._id;
  const ticket = req.body.ticket;
  try {
    const content = `${req.session.user.username} 修改了:${JSON.stringify(ticket)}`;
    const oldTicket = await mdb.Ticket.findByIdAndUpdate(_id, _.assign({
      $push: {
        events: {
          $each: [{
            content,
          }],
          $position: 0,
        },
      },
    }, ticket));

    if (oldTicket.progress !== ticket.progress) {
      alipush.pushTicket(_id);
    }
    req.session.msg = '修改工作票成功!';
    res.redirect(`/crud/${ticket.ticket_template}/${_id}`);
  } catch (err) {
    logger.error(err);
    req.session.error = '修改工作票失败!';
    res.redirect(`/crud/${ticket.ticket_template}/${_id}/edit`);
  }
};

exports.delete = (req, res) => {
  let result = '';
  logger.debug('delete:', req.var_name._id);

  if (req.var_name.progress !== '处理完毕') {
    req.session.error = '未处理完毕！删除失败工作票!';
    res.json({ success: false, result });
  } else {
    mdb.Ticket.remove({
      _id: req.var_name._id,
    }).then(() => {
      req.session.msg = '工作票删除成功!';
      result = 'Deleted';

      res.json({
        success: true,
        result,
      });
    }).catch((err) => {
      logger.error(err);
      req.session.error = '删除失败工作票!';
      result = err.message;
      res.json({
        success: false,
        result,
      });
    });
  }
};

exports.my_tickets = (req, res) => {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;

  let criteria = {
    $or: [{
      to: {
        $in: [req.session.user._id],
      },
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

  mdb.Ticket.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.Ticket
      .find(criteria)
      .populate('from_admin', 'fullname avatar')
      .populate('from_user', 'fullname avatar')
      .populate('ticket_template')
      .sort('-_id')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    //
    res.render('crud-ticket/my_tickets', {
      title: '我的任务',
      list,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};

// form数据
exports.post_ticket_form_data = async function (req, res) {
  const { _id, goto_nextstep, form_data } = req.body;
  try {
    const oldTicket = await mdb.Ticket.findById(_id).populate('company ticket_template');
    //已经无效不能审批
    if (oldTicket.delete_flag) {
      req.session.error = '该表单已经失效!';
    } else {
      const content = `${req.session.user.username} 填写了表单:${JSON.stringify(form_data)}`;
      const data = {
        form_data: _.assign(oldTicket.form_data, form_data),
        $push: {
          events: {
            $each: [{
              content,
            }],
            $position: 0,
          },
        },
      };
      //如果是报修维修指派通知处理，从处理中状态变为指派中推送，指派中修改了指派人也推送
      if (oldTicket.ticket_template === 'property_repair' && (goto_nextstep === '任务接单' || oldTicket.progress === '任务接单')) {
        data.form_data.assign_date = new Date(); // 维修人员接单后半小时之内无反馈，提醒工程经理，需要指派时间

        const admin = await mdb.Admin.findById(form_data.property_repair_admin);
        const content = `${oldTicket.company.company_name}的报修维修被指派给了${admin.fullname}`;
        alipush.pushTicket(_id, { content });
      }
      // 是否进入到下一步
      if (goto_nextstep) {
        data.progress = goto_nextstep;

        logger.debug("progress_redirects", oldTicket.ticket_template.progress_redirects);

        //是否有需要跳转到特殊步骤
        if(oldTicket.ticket_template.progress_redirects) {
          _.map(oldTicket.ticket_template.progress_redirects, (progress_redirect) => {
            logger.debug("progress_redirect", progress_redirect);
            if(progress_redirect.current_step === goto_nextstep) {
              logger.debug("progress_redirect.check_key", progress_redirect.check_key);
              logger.debug("fromdata_value", form_data[progress_redirect.check_key]);
              logger.debug("check_value", progress_redirect.check_value);
              form_data[progress_redirect.check_key] === progress_redirect.check_value;
              data.progress = progress_redirect.redirect_step;
            }
          });
        }
      }

      await mdb.Ticket.findByIdAndUpdate(_id, data);

      // 进入新的step， 要推送给下一步的role
      if (goto_nextstep) {
        alipush.pushTicket(_id);
      }
      req.session.msg = '填写了表单成功!';
    }
  } catch (err) {
    logger.error(err);
    req.session.error = '填写了表单失败!';
  }
  const ticket = await mdb.Ticket.findById(_id);
  res.redirect(`/crud/${ticket.ticket_template}/${_id}`);
};

// 受理
exports.post_start_process_ticket = async function (req, res) {
  const ticket_id = req.query.ticket_id;
  await mdb.Ticket.findByIdAndUpdate(ticket_id, {
    progress: '进行中',
    $push: {
      events: {
        $each: [{
          content: `${req.session.user.username} 受理了此工作票`,
        }],
        $position: 0,
      },
    },
  });

  // 进入新的step， 要推送给下一步的role
  alipush.pushTicket(ticket_id);
  res.json({
    success: true,
  });
};

exports.post_add_ticket_comment = async (req, res) => {
  const ticket_id = req.query.ticket_id;
  const admin_id = req.body.admin_id;
  const content = req.body.content;
  try {
    const ticket = await mdb.Ticket.findByIdAndUpdate(ticket_id, {
      $push: {
        comments: {
          $each: [{
            admin: admin_id,
            content,
          }],
        },
      },
    }, {
      setDefaultsOnInsert: true,
      new: true,
    });
    alipush.pushTicket(ticket._id, { content });

    res.json({
      success: true,
      ticket,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
};

exports.ticket_export_excel = async function (req, res) {
  const ticket_id = req.query.ticket_id;
  if (!ticket_id) {
    res.json({
      success: false,
    });
  }

  const ticket = await mdb.Ticket.findById(ticket_id).select('form_data ticket_template').populate('ticket_template');
  try {
    const filename = await exportXlsx.printTicketTemplate(ticket);
    res.json({
      success: true,
      data: filename,
    });
  } catch (err) {
    logger.error(err);
  }
};
