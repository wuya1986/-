const assert = require('assert');
const _ = require('lodash');

const cms = require('../lib/cms');

describe('cms', () => {
  it('swipers', async () => {
    const res = await cms.swipers();
    console.log(res);
  });
  it('news', async () => {
    const res = await cms.news();
    console.log(res);
  });
});
