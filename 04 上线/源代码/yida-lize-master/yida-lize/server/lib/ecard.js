const config = require('../config');
/*
 *  { name: 'AIO20170913105955' } ],
 * */
const logger = require('../lib/logging').getLogger('lib/ecard.js');
const { promisify } = require('util');
const moment = require('moment');
const sql = require('mssql');

const mssql = require('../lib/mssql');

module.exports = class ECard {
  async sql(sql) {
    try {
      const result = await mssql.request()
        .query(sql);
      return result.recordset;
    } catch (err) {
      logger.error(err);
      return 0;
    }
  }

  async balance(ecard) {
    try {
      const str = `
select top 1 a.AccCurrMoney
from Pos_AccHead a
INNER JOIN Com_EmpCard c ON a.CARDID = c.CARDID
INNER JOIN Hrms_Emp  e ON e.EMPID = c.EMPID
where
c.CARDSTATUSID=20
AND e.EmpNO='${ecard}'
order by secid desc
`;
      logger.info(str, ecard);
      const result = await mssql.request()
        .query(str);
      if (result.recordset.length > 0) {
        const [{ AccCurrMoney }] = result.recordset;
      } return 0;
      return AccCurrMoney;
    } catch (err) {
      logger.error(err);
      return 0;
    }
  }

  async consume_list(ecard) {
    try {
      const month1ago = moment().subtract(1, 'month').toDate();
      const str = `
select '消费' title, XFPOSDAY ymd, XFPOSMONEY fee,XFCARDMONEY balance
from POS_XFDATA a
INNER JOIN Com_EmpCard c ON a.CARDID = c.CARDID
INNER JOIN Hrms_Emp  e ON e.EMPID = c.EMPID
where
c.CARDSTATUSID=20
AND e.EmpNO='${ecard}'
and XFPOSDAY > @input_parameter2
order by secid desc
`;
      logger.info(str, ecard, month1ago);
      const result = await mssql.request()
        .input('input_parameter2', sql.DateTime, month1ago)
        .query(str);
      return result.recordset;
    } catch (err) {
      logger.error(err);
      return 0;
    }
  }

  async recharge_list(ecard) {
    try {
      const month1ago = moment().subtract(1, 'month').toDate();
      const str = `
select '充值' title, PUTMONEYDAY ymd, PUTMONEYVALUE fee, CARDMONEYAFTER balance
from Pos_PutMoney a
INNER JOIN Com_EmpCard c ON a.CARDID = c.CARDID
INNER JOIN Hrms_Emp  e ON e.EMPID = c.EMPID
where
c.CARDSTATUSID=20
AND e.EmpNO='${ecard}'
and PUTMONEYDAY > @input_parameter2
`;
      logger.info(str, ecard, month1ago);
      const result = await mssql.request()
        .input('input_parameter2', sql.DateTime, month1ago)
        .query(str);
      return result.recordset;
    } catch (err) {
      logger.error(err);
      return 0;
    }
  }
};
