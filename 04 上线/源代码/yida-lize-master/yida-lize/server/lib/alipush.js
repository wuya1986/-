const config = require('../config');
const logger = require('../lib/logging').getLogger('lib/alipush.js');
const _ = require('lodash');
const redis = require('promise-redis')();

const redisClient = redis.createClient(config.redis);

const ALY = require('aliyun-sdk');
const mdb = require('../mongoose');

/* {
 *   accessKeyId: config.aliyun.push.accessKeyId,
 *   secretAccessKey: config.aliyun.push.secretAccessKey,
 *   endpoint: config.aliyun.push.endpoint,
 *   apiVersion: config.aliyun.push.apiVersion,
 * }
 */
class AliPush {
  constructor(options) {
    this.options = options;
    this.alipush = new ALY.PUSH(options);
  }

  /**
   * ref: https://help.aliyun.com/knowledge_detail/48088.html?spm=5176.7848064.2.4.4sBZZv
   * @param {*} to
   * @param {*} title
   * @param {*} content
   */
  pushToiOS(to, title, content) {
    const me = this;
    return new Promise((resolve, reject) => {
      me.alipush.pushNoticeToiOS({
        AppKey: me.options.iOS.appKey,
        Target: 'DEVICE',
        TargetValue: to,
        ApnsEnv: 'DEV',
        Body: content,
      }, (err, json) => {
        if (err) {
          logger.info(err);
          reject(err);
        } else {
          resolve(json);
        }
      });
    });
  }

  pushToiOSWithBadge(to, title, content, badge_count = 1) {
    const me = this;
    return new Promise((resolve, reject) => {
      me.alipush.push({
        AppKey: me.options.iOS.appKey,
        Target: 'DEVICE',
        TargetValue: to,
        PushType: 'NOTICE',
        DeviceType: 'iOS',
        iOSApnsEnv: 'DEV',
        Body: content,
        iOSBadge: badge_count,
      }, (err, json) => {
        if (err) {
          logger.info(err);
          reject(err);
        } else {
          resolve(json);
        }
      });
    });
  }

  /**
   * ref: https://help.aliyun.com/knowledge_detail/48087.html?spm=5176.7848064.2.3.4sBZZv
   * @param {*} to
   * @param {*} title
   * @param {*} content
   */
  pushToAndroid(to, title, content, badge_count = 1) {
    const me = this;
    return new Promise((resolve, reject) => {
      me.alipush.pushNoticeToAndroid({
        AppKey: me.options.android.appKey,
        Target: 'DEVICE',
        TargetValue: to,
        Title: title,
        Body: content,
        ExtParameters: `{"badge": ${badge_count}}`,
      }, (err, json) => {
        if (err) {
          logger.info(err);
          reject(err);
        } else {
          resolve(json);
        }
      });
    });
  }

  // [ { push_device_id: '6e1b103a3b384c60b735db1eb36936a3', push_device_type: 'android' }, { push_device_id: '6e1b103a3b384c60b735db1eb36936a3', push_device_type: 'ios' } ]
  async push(devices, title, content) {
    const me = this;
    const push_promises = _.map(_.uniq(devices), async (device) => {
      if (device && device.push_device_id && device.push_device_type) {
        const { push_device_id, push_device_type } = device;

        const push_badge_key = `${push_device_id}_push_badge`;

        const badge_count = await redisClient.incr(push_badge_key);

        logger.info('push', push_badge_key, push_device_type, badge_count, content);
        if (push_device_type === 'ios') {
          await me.pushToiOSWithBadge(push_device_id, title, content, badge_count);
        } else if (push_device_type === 'android') {
          await me.pushToAndroid(push_device_id, title, content, badge_count);
        }
      }
    });

    await Promise.all(push_promises);
  }
}

const user = exports.user = new AliPush(config.aliyun.user_push);
const staff = exports.staff = new AliPush(config.aliyun.staff_push);

// type: user, staff
const pushMessage = exports.pushMessage = async (message_id) => {
  const message = await mdb.Message.findById(message_id)
    .populate('from_admin', 'fullname')
    .populate('to_admin', 'push_device_id push_device_type')
    .populate('to_user', 'push_device_id push_device_type');

  const content = (message.from_admin ? `${message.from_admin.fullname}给您发了消息：` : '') + message.content;
  if (message.to_admin) {
    staff.push([message.to_admin], '通知', content);
  }

  if (message.to_user) {
    user.push([message.to_user], '通知', content);
  }
};

// options: {content: 'xxxx'}
const pushTicket = exports.pushTicket = async (ticket_id, options) => {
  const ticket = await mdb.Ticket.findById(ticket_id)
    .populate('ticket_template', 'title progress_extensions')
    .populate('from_user', 'fullname push_device_id push_device_type')
    .populate('company', 'company_name');

  //通知规则，有企业名称显示企业名称，有提出者显示提出者
  const content = `${ticket.ticket_template.title}:${(options && options.content) ? options.content : `${ticket.company ? ticket.company.company_name : ''}${ticket.from_user ? ticket.from_user.fullname : ''}的工单当前状态为${ticket.progress}，请注意查看`}`;
  //确定from是谁
  const from_data = ticket.from_user ? { from_user: ticket.from_user._id } : (ticket.from_admin ? { from_admin: ticket.from_admin } : {});

  // 当前progess对应的roles的所有staff
  await Promise.all(_.map(await mdb.Admin.find({
    acl_roles: {
      $in: _.find(ticket.ticket_template.progress_extensions, { step: ticket.progress }).roles,
    },
  }).select('_id'), async (to_admin) => {
    const dbMessage = new mdb.Message({
      ...from_data,
      to_admin,
      content,
      business_type: ticket.ticket_template._id,
      extensions: {
        staff_url: `/crud/${ticket.ticket_template._id}/${ticket._id}`,
        user_url: `/tickets/show/${ticket.ticket_template._id}/${ticket._id}`,
      },
    });
    await dbMessage.save();
    // push message
    pushMessage(dbMessage._id);
  }));

  // 当前票的企业的所有授权人
  await Promise.all(_.map(await mdb.User.find({
    company: ticket.company,
    role: '授权人',
  }).select('_id'), async (to_user) => {
    //有fromuser进行重复判断，没有就直接保存
    if (!ticket.from_user || (ticket.from_user && !_.isEqual(to_user._id, ticket.from_user._id))) {
      const dbMessage = new mdb.Message({
        ...from_data,
        to_user,
        content,
        business_type: ticket.ticket_template._id,
        extensions: {
          staff_url: `/crud/${ticket.ticket_template._id}/${ticket._id}`,
          user_url: `/tickets/show/${ticket.ticket_template._id}/${ticket._id}`,
        },
      });
      await dbMessage.save();
      // push message
      pushMessage(dbMessage._id);
    }
  }));
  //存在fromuser才保存否则略过
  if (ticket.from_user) {
    const dbMessage = new mdb.Message({
      from_admin: '5a251c2a5f27a47257684115',
      to_user: ticket.from_user,
      content,
      business_type: ticket.ticket_template._id,
      extensions: {
        staff_url: `/crud/${ticket.ticket_template._id}/${ticket._id}`,
        user_url: `/tickets/show/${ticket.ticket_template._id}/${ticket._id}`,
      },
    });
    await dbMessage.save();
    // push message
    pushMessage(dbMessage._id);
  }
};
