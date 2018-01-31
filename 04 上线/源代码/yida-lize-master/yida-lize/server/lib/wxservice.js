const config = require('../config');
const logger = require('../lib/logging').getLogger('lib/wxservice');
const nwApi = require('node-weixin-api');

const EVENT_WEIXIN_API_RESULT = 'weixin_api_result';
const EventEmitter = require('events').EventEmitter;

const event = new EventEmitter();
event.on(EVENT_WEIXIN_API_RESULT, (errcode, errmsg, var1, var2) => {
  logger.info('%s, %s, %s, %s', errcode, errmsg, var1, var2);
  switch (errcode) {
    case 40001:
      break;
    default:
  }
});

const nwm = nwApi.message;
module.exports = class WxService {
  constructor(app) {
    this.app = app;
    this.service = nwm.service;
    this.template = nwm.template;
  }

  text(settings, openid, msg) {
    logger.info('text: %s, %s', openid, msg);
    return new Promise((resolve) => {
      this.service.api.text(settings, this.app, openid, msg, (err, data) => {
        event.emit(EVENT_WEIXIN_API_RESULT, data.errcode, data.errmsg);
        logger.info('wxservice.text:', openid, msg, err, data);
        if (err) {
          throw err;
        } else {
          resolve(data);
        }
      });
    });
  }

  image(settings, openid, mediaId) {
    logger.info('image: %s, %s', openid, mediaId);
    return new Promise((resolve) => {
      this.service.api.image(settings, this.app, openid, mediaId, (err, data) => {
        event.emit(EVENT_WEIXIN_API_RESULT, data.errcode, data.errmsg);
        logger.info('wxservice.image:', openid, mediaId, err, data);
        if (err) {
          throw err;
        } else {
          resolve(data);
        }
      });
    });
  }

  sendtemplate(settings, openid, templateId, url, data) {
    logger.info('sendtemplate: %s, %s, %s, %s', openid, templateId, url, data);
    return new Promise((resolve) => {
      this.template.send(settings, this.app, openid, templateId, url, data, (err, d) => {
        event.emit(EVENT_WEIXIN_API_RESULT, d.errcode, d.errmsg);
        logger.info('wxservice.template:', openid, templateId, url, err, d);
        if (err) {
          throw err;
        } else {
          resolve(d);
        }
      });
    });
  }
};
