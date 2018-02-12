const config = require('../config');
const _ = require('lodash');

const assert = require('assert');

const alipush = require('../lib/alipush');

const mdb = require('../mongoose');

describe('alipush', () => {
  it('Push to iOS', async () => {
    let res = await alipush.user.pushToiOSWithBadge('9c1b7a919f654dc392fe8c7aa8cd5748', 'Test Push', 'oh~~,look.', 1122);
    console.log(res.RequestId);
    res = await alipush.staff.pushToiOSWithBadge('7d70d57d280e401db98e4d2d26442e1e', 'Test Push', 'oh~~,look.', 1122);
    console.log(res.RequestId);
  });

  /* it('Push to multi user devices', async () => {
   *   const devices = await mdb.User.find({
   *   }).select('push_device_id push_device_type');

   *   await alipush.user.push(devices, 'Test Push', 'User EVIBODY.');
   * });
   */
  it('Push to multi staff devices', async () => {
    const devices = await mdb.Admin.find({
    }).select('push_device_id push_device_type');

    await alipush.staff.push(devices, 'Test Push', 'Staff 你们好吗.');
  });

  it('Push message to multi people', async () => {
    await alipush.pushTicket('5a31fd98c2ddaa763dcc621f');
  });
});
