const assert = require('assert');
const juhe = require('../lib/juhe');

describe('juhe', () => {
  it('sms', async () => {
    const mobile = 18624357886;
    const tpl_id = 55504;
    const value = '#code#=1234';

    const results = await juhe.sms(mobile, tpl_id, value);

    console.log(results);
  });
});
