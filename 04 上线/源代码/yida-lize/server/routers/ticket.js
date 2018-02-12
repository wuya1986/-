const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/ticket');
const _ = require('lodash');
const alipush = require('../lib/alipush');
const ticket_indicates = require('../ticket_indicates');
const moment = require('moment');

const express = require('express');
const mdb = require('../mongoose');

const router = express.Router();

// ticket
// curl -X GET https://admin.yidalize.com/ticket/ticket/56789 -H "Authorization: Bearer JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP"
router.get('/ticket/:_id', async (req, res, next) => {
  try {
    let ticket = await mdb.Ticket.findById(req.params._id)
      .populate('from_admin', 'fullname avatar')
      .populate('from_user', 'fullname avatar')
      .populate('to', 'fullname avatar')
      .populate('ticket_template', 'title user_guide');

    if(ticket) {
      ticket = ticket.toObject();

      const indicates = ticket_indicates[ticket.ticket_template._id];
      let progress_over = true;
      _.map(indicates, async (indicate) => {
        indicate.progress_over = progress_over;
        if(indicate.progress === ticket.progress) {
          progress_over = false;
        }
        return indicate;
      });

      ticket.ticket_indicates = indicates;
    }
    
    res.json({
      success: true,
      data: ticket,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// ticket_template
// curl -X GET https://admin.yidalize.com/ticket/ticket_template/property_repair -H "Authorization: Bearer JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP"
router.get('/ticket_template/:_id', async (req, res, next) => {
  try {
    let ticket_template = await mdb.TicketTemplate.findById(req.params._id);

    if (req.params._id === 'deposit_refund') {
      ticket_template = ticket_template.toObject();
      ticket_template.can_create = false;
      const ticket = await mdb.Ticket.findOne({ ticket_template: 'completed_acceptance_check' }).sort({ _id: -1 }).limit(1);
      if (ticket) {
        logger.info('date', ticket.create_date, moment().add(30, 'days'));
        ticket_template.can_create = moment(ticket.create_date).isAfter(moment().add(30, 'days'));
      }
    }
    res.json({
      success: true,
      data: ticket_template,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// 我的所有的ticket
// curl -X GET https://admin.yidalize.com/ticket/user_tickets -H "Authorization: Bearer JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP"
router.get('/user_tickets', async (req, res, next) => {
  try {
    let criteria = {};
    //投诉建议，企业授权人要看到所有自己企业的投诉,房屋交接是admin端发起的需要检索企业
    if ((req.query.ticket_template === 'complaint_advice' || req.query.ticket_template === 'office_handover') && req.$userInfo.role === '授权人') {
      criteria = {
        company: req.$userInfo.company._id,
      };
    } else {
      criteria = {
        from_user: req.$userInfo._id,
      };
    }
    const tickets = await mdb.Ticket.find(_.assign(req.query, {
      ...criteria,
    }))
      .populate('ticket_template', 'title')
      .populate('from_user', 'fullname avatar')
      .sort({
        _id: -1,
      })
      .limit(config.pageSize);

    res.json({
      success: true,
      data: tickets,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// 认证
// curl -X POST https://admin.yidalize.com/ticket/add_ticket  -H "Authorization: Bearer JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP" -H "Content-Type: application/json" -d '{"content":"content", "ticket_template": "property_repair"}'
router.post('/add_ticket', async (req, res, next) => {
  try {
    const ticketTemplate = await mdb.TicketTemplate.findById(req.body.ticket_template);
    const progress = req.body.progress ? req.body.progress : '已受理';
    //检查user状态
    const user = await mdb.User.findById(req.$userInfo._id).select('delete_flag');
    if (user.delete_flag) {
      res.json({
        success: false,
        msg: '该用户无效',
      });
      return;
    }
    //检查company状态
    const company = await mdb.Company.findById(req.$userInfo.company).select('delete_flag');
    if (company.delete_flag) {
      res.json({
        success: false,
        msg: '该企业无效',
      });
      return;
    }

    const dbTicket = new mdb.Ticket(_.assign(req.body, {
      from_user: req.$userInfo._id,
      to: await mdb.Admin.find({
        acl_roles: {
          $in: _.find(ticketTemplate.progress_extensions, { step: progress }).roles,
        },
      }).select('_id'),
    }));
    await dbTicket.save();
    // alipush.pushTicket(dbTicket._id);
    // push admin
    const content = `${req.$userInfo.fullname} 提交了工单 ${req.body.content}`;
    await Promise.all(_.map(await mdb.Admin.find({
      acl_roles: {
        $in: _.find(ticketTemplate.progress_extensions, { step: progress }).roles,
      },
    }).select('_id'), async (to_admin) => {
      const dbMessage = new mdb.Message({
        from_user: req.$userInfo._id,
        to_admin,
        content,
        business_type: req.body.ticket_template,
        extensions: {
          staff_url: `/crud/${req.body.ticket_template}/${dbTicket._id}`,
        },
      });
      await dbMessage.save();
      // push message
      alipush.pushMessage(dbMessage._id);
    }));

    //员工提的票，需要通知给“授权人”一声
    if (req.$userInfo.role === '员工') {
      await Promise.all(_.map(await mdb.User.find({
        company: req.$userInfo.company,
        role: '授权人',
      }).select('_id'), async (to_user) => {
        const dbMessage = new mdb.Message({
          from_user: req.$userInfo._id,
          to_user,
          content,
        });
        await dbMessage.save();
        // push message
        alipush.pushMessage(dbMessage._id);
      }));
    }
    res.json({
      success: true,
      data: dbTicket,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

router.post('/add_ticket_comment', async (req, res, next) => {
  try {
    const { user_comment, ticket_id } = req.body;
    const dbTicket = await mdb.Ticket.findByIdAndUpdate(ticket_id, {
      user_comment,
    }, {
      new: true,
    });

    alipush.pushTicket(dbTicket._id, {
      content: `${req.$userInfo.company.company_name}${req.$userInfo.fullname}做了评价`,
    });
    res.json({
      success: true,
      data: dbTicket,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

router.post('/add_ticket_user_closed', async (req, res, next) => {
  try {
    const { user_closed, ticket_id } = req.body;
    const dbTicket = await mdb.Ticket.findByIdAndUpdate(ticket_id, {
      user_closed,
    }, {
      new: true,
    });

    alipush.pushTicket(dbTicket._id, {
      content: `${req.$userInfo.company.company_name}${req.$userInfo.fullname}做了评价`,
    });
    res.json({
      success: true,
      data: dbTicket,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

//取得我的某个ticket_template的ticket最新一条
// curl -X GET https://admin.yidalize.com/ticket/user_last_ticket/settle_in  -H "Authorization: Bearer JDJhJDEwJHV5djIwa2ZjeWo3cVowMVdvcFNvUy42azVXVXhLR00vQ1poLkE4akx2OC5pTnhZRXdudjll"
router.get('/user_last_ticket/:ticket_template_id', async (req, res, next) => {
  try {
    let ticket = await mdb.Ticket.findOne({
      from_user: req.$userInfo._id,
      ticket_template: req.params.ticket_template_id,
      delete_flag: false,
    }).sort('-_id');

    if(ticket) {
      ticket = ticket.toObject();

      const indicates = ticket_indicates[ticket.ticket_template];
      let progress_over = true;
      _.map(indicates, async (indicate) => {
        indicate.progress_over = progress_over;
        if(indicate.progress === ticket.progress) {
          progress_over = false;
        }
        return indicate;
      });

      ticket.ticket_indicates = indicates;
    }
    logger.debug('ticket', ticket);
    res.json({
      success: true,
      data: ticket,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

module.exports = router;
