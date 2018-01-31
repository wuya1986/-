// 微信优惠券
const config = require('../config.js');
const logger = require('../lib/logging').getLogger('lib/qrcode.js');

const nwApi = require('node-weixin-api');

const nwl = nwApi.link;

//
module.exports = class QRCode {
  temporaryQrcode(setting, app, param) {
    return new Promise((resolve, reject) => {
      nwl.qrcode.temporary.create(setting, app, param, (err, json) => {
        if (err) {
          logger.info(err);
          reject(err);
        } else {
          const qr_url = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${json.ticket}`;
          logger.info('qrcode.temporary url:', qr_url);
          resolve(qr_url);
        }
      });
    });
  }

  permanentQrcode(setting, app, param) {
    return new Promise((resolve, reject) => {
      nwl.qrcode.permanent.createString(setting, app, param, (err, json) => {
        if (err) {
          logger.info(err);
          reject(err);
        } else {
          const qr_url = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${json.ticket}`;
          logger.info('qrcode.permanent url: %s', qr_url);
          resolve(qr_url);
        }
      });
    });
  }
};
