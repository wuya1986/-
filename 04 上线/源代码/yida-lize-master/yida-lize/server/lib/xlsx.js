const logger = require('../lib/logging').getLogger('lib/xlsx');

const XLSX = require('xlsx');
const _ = require('lodash');

const mdb = require('../mongoose');

function validNotNull(rows, cols) {
  for (const row of rows) {
    for (const col of cols) {
      if (row[col] === undefined) {
        logger.error(`行${row}列${col}的数据格式检查失败。`, row);
        return false;
      }
    }
  }
  return true;
}

//
// 导入集体充值数据
// 业务编号，对某一个公司来讲，充值编号应该是唯一的，导入之前数据库里是不存在这个业务编号的
// 公司全称，匹配公司信息
// 员工一卡通号码，和 员工姓名，匹配员工信息
// 金额，大于0的数字
// 以上，检查有错误的话，本次集体充值会失败，可以修改错误，重新尝试导入
exports.parseBatchlyCharge = async (file, company_id) => {
  const cols = ['业务编号', '公司全称', '员工姓名', '员工一卡通号码', '金额'];

  async function processRows(rows) {
    // check
    if (rows.length === 0) {
      return '没有业务数据';
    }
    // 公司全称
    const company_names = _.sortedUniq(_.map(rows, cols[1]));
    if (company_names.length > 1) {
      return '多个公司全称';
    }

    // 业务编号
    const transactionIds = _.sortedUniq(_.map(rows, cols[0]));
    if (transactionIds.length !== rows.length) {
      return '发现有重复的业务编号';
    }
    const duplicated_transactionIds_count = await mdb.BatchlyCharge.count({
      company_name: rows[0][cols[1]],
      transaction_id: {
        $in: transactionIds,
      },
    });
    if (duplicated_transactionIds_count > 0) {
      return '发现已处理过的业务编号';
    }

    // logger.info('rooms', room_results);
  }

  const workbook = XLSX.readFile(file);
  const rows = _.flatten(_.map(workbook.SheetNames, (ws) => {
    const worksheet = workbook.Sheets[ws];
    const rs = XLSX.utils.sheet_to_row_object_array(worksheet);
    return rs;
  }));

  if (!validNotNull(rows, cols)) {
    return '数据解析错误';
  }

  //
  await processRows(rows);
  return `${rows.length}条数据导入完毕。`;
};


exports.parseUserImport = async (file, company_id) => {
  const cols = ['姓名', '性别', '电话号码', '身份证号码', '一卡通号码', '车牌号码', '身份标识'];

  async function processRows(rows) {
    // check
    if (rows.length === 0) {
      return '没有业务数据';
    }
    // 电话号码
    const mobile_nos = _.sortedUniq(_.map(rows, cols[2]));
    logger.debug('mobile_nos', mobile_nos);
    if (mobile_nos.length !== rows.length) {
      return '电话号码重复';
    }
    // 身份证号码
    const id_cards = _.sortedUniq(_.map(rows, cols[3]));
    if (id_cards.length !== rows.length) {
      return '身份证号码重复';
    }
    // 一卡通号码号码
    const ecards = _.sortedUniq(_.map(rows, cols[4]));
    if (ecards.length !== rows.length) {
      return '一卡通号码重复';
    }
    const user_promises = _.map(rows, async (row) => {
      logger.debug(row[cols[2]]);
      await mdb.User.findOneAndUpdate({
        mobile_no: row[cols[2]],
      }, {
        fullname: row[cols[0]],
        sex: row[cols[1]] === '男' ? 1 : 2,
        mobile_no: row[cols[2]],
        id_card: row[cols[3]],
        e_card: row[cols[4]],
        vpl_number: row[cols[5]],
        role: row[cols[6]],
        company: company_id,
      }, {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
      });
    });

    await Promise.all(user_promises);
  }

  const workbook = XLSX.readFile(file);
  const rows = _.flatten(_.map(workbook.SheetNames, (ws) => {
    const worksheet = workbook.Sheets[ws];
    const rs = XLSX.utils.sheet_to_row_object_array(worksheet);
    return rs;
  }));

  if (!validNotNull(rows, cols)) {
    return '数据解析错误';
  }

  await processRows(rows);
  return `${rows.length}条数据导入完毕。`;
};
