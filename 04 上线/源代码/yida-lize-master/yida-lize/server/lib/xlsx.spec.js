const config = require('../config');
const logger = require('../lib/logging').getLogger('xlsx.spec');

const assert = require('assert');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');
const xlsx = require('../lib/xlsx');
const mdb = require('../mongoose');

describe('buildings', () => {
  it('read', async () => {
    const zone = await mdb.Zone.findOne({});
    await xlsx.parseBuildings(path.join(__dirname, '..', 'public', '1.房屋基本状况一览表.xlsx'), zone);
  });
});
