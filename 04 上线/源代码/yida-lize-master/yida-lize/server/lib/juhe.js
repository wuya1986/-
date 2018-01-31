/**
 * juheAPI服务
 */
const config = require('../config');
const logger = require('../lib/logging').getLogger('lib/juhe');

const request = require('request-promise');

// 短信
const sms = async (mobile, tpl_id, tpl_value) => {
  const url = `http://v.juhe.cn/sms/send?mobile=${mobile}&tpl_id=${tpl_id}&tpl_value=${encodeURIComponent(tpl_value)}&key=${config.juhe.sms}`;
  logger.info(url);
  const results = await request(url);
  /* const results = JSON.stringify({
   *   reason: '短信发送成功',
   *   error_code: 0,
   * });
   */
  return JSON.parse(results);
};

exports.sms = sms;
