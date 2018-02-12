const config = require('../config');
const logger = require('../lib/logging').getLogger('controllers/crud-ticket_template');

const _ = require('lodash');
const mdb = require('../mongoose');

exports.prefix = '/crud';

exports.name = 'ticket_template';

exports.before = async function (req, res, next) {
  const _id = req.params._id;
  if (!_id) return next();
  const ticketTemplate = await mdb.TicketTemplate
    .findById(_id);
  if (!ticketTemplate) return next('route');
  req.var_name = ticketTemplate;
  next();
};

exports.index = function (req, res) {
  res.redirect('/crud/ticket_templates');
};

exports.list = function (req, res) {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;

  let criteria = {};
  if (keyword) {
    criteria = {
      $or: [{
        title: {
          $regex: `.*${keyword}.*`,
        },
      }, {
        form_file: {
          $regex: `.*${keyword}.*`,
        },
      },
      ],
    };
  }

  logger.debug('criteria', criteria);

  mdb.TicketTemplate.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.TicketTemplate.find(criteria)
      .sort('_id')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    //
    res.render('crud-ticket_template/list', {
      title: '工作票模版列表',
      list,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};

exports.new = function (req, res) {
  res.render('crud-ticket_template/new', {
    title: '新建工作票模版',
  });
};

exports.create = async function (req, res) {
  const ticketTemplate = req.body.ticketTemplate;

  if (ticketTemplate) {
    try {
      if (ticketTemplate.progress_extensions) {
        ticketTemplate.progress_extensions = JSON.parse(ticketTemplate.progress_extensions);
      }
      if (ticketTemplate.progress_redirects) {
        ticketTemplate.progress_redirects = JSON.parse(ticketTemplate.progress_redirects);
      }
      const dbTicketTemplate = new mdb.TicketTemplate(ticketTemplate);
      await dbTicketTemplate.save();

      req.session.msg = '新建工作票模版成功!';
      res.redirect(`/crud/ticket_template/${dbTicketTemplate._id}`);
    } catch (err) {
      logger.error(err);
      req.session.error = err.message;
      res.redirect('back');
    }
  } else {
    res.redirect('/crud/ticket_templates');
  }
};

exports.show = async function (req, res) {
  res.render('crud-ticket_template/show', {
    title: '工作票模版详细',
    data: req.var_name,
  });
};

exports.edit = function (req, res) {
  res.render('crud-ticket_template/edit', {
    title: '修改工作票模版',
    data: req.var_name,
  });
};

exports.update = async function (req, res) {
  const _id = req.params._id;
  const ticketTemplate = req.body.ticketTemplate;
  try {
    if (ticketTemplate.progress_extensions) {
      ticketTemplate.progress_extensions = JSON.parse(ticketTemplate.progress_extensions);
    }
    if (ticketTemplate.progress_redirects) {
      ticketTemplate.progress_redirects = JSON.parse(ticketTemplate.progress_redirects);
    }
    const content = `${req.session.user.username} 修改了:${JSON.stringify(ticketTemplate)}`;
    await mdb.TicketTemplate.findByIdAndUpdate(_id, _.assign({
      $push: {
        events: {
          $each: [{
            content,
          }],
          $position: 0,
        },
      },
    }, ticketTemplate));
    req.session.msg = '修改工作票模版成功!';
    res.redirect(`/crud/ticket_template/${_id}`);
  } catch (err) {
    req.session.error = '修改工作票模版失败!';
    res.redirect(`/crud/ticket_template/${_id}/edit`);
  }
};

exports.delete = function (req, res) {
  let result = '';

  mdb.TicketTemplate.findOneAndRemove({ _id: req.var_name._id }, (err) => {
    if (err) {
      req.session.error = '删除工作票模版失败!';
      result = err.message;
    } else {
      req.session.msg = '删除工作票模版成功!';
      result = 'Deleted';
    }

    res.json({ result });
  });
};
