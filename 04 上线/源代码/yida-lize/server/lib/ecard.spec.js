const config = require('../config');
const logger = require('../lib/logging').getLogger('lib/ecard.spec.js');
const _ = require('lodash');

const assert = require('assert');

const ECard = require('./ecard');

describe('ecard', () => {
  it('sql', async () => {
    const ecard = new ECard();
    // const recordset = await ecard.sql('select EmpID, EmpNo from Hrms_Emp where EmpID=352');
    // const recordset = await ecard.sql('select a.EmpID, a.CARDID, a.CARDSTATUSID from Com_EmpCard a INNER JOIN Hrms_Emp b ON a.EmpID = b.EmpID where a.EmpID=11 ');
    const recordset = await ecard.sql(`
select PUTMONEYDAY ymd, PUTMONEYVALUE fee, CARDMONEYAFTER balance
from Pos_PutMoney a
INNER JOIN Com_EmpCard c ON a.CARDID = c.CARDID
INNER JOIN Hrms_Emp  e ON e.EMPID = c.EMPID
where
e.EmpNO='门侧'
AND c.CARDSTATUSID=20
order by secid desc
`);
    logger.error(recordset);
  });
  it('balance', async () => {
    const ecard = new ECard();
    const balance = await ecard.balance('门侧');
    logger.error(balance);

    const consume_list = await ecard.consume_list('门侧');
    logger.error(consume_list);

    const recharge_list = await ecard.recharge_list('门侧');
    logger.error(consume_list);
  });
});
