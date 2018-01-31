const logger = require('../lib/logging').getLogger('controllers/acl');
const config = require('../config');
const path = require('path');
const _ = require('lodash');

const upload = require('jquery-file-upload-middleware');

const mdb = require('../mongoose');
const xlsx = require('../lib/xlsx');

upload.configure({
  uploadDir: config.tmpdir,
});
upload.on('begin', (fileInfo, req, res) => {
  logger.debug('begin fileInfo:', fileInfo);
});
upload.on('end', (fileInfo, req, res) => {
  logger.debug('end fileInfo:', fileInfo);
});

exports.prefix = '/utils';

exports.users_json = async (req, res) => {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;
  const criteria = {
    delete_flag: false,
    $or: [{
      mobile_no: {
        $regex: `.*${keyword}.*`,
      },
    }, {
      fullname: {
        $regex: `.*${keyword}.*`,
      },
    },
    ],
  };
  const count = await mdb.User.count(criteria);
  const pagination = {
    page,
    pageSize: config.pageSize,
    rowCount: count,
    pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
  };

  const users = await mdb.User.find(criteria).select('_id fullname id_card mobile_no');

  res.json({
    models: users,
    pagination,
  });
};

exports.companys_json = async (req, res) => {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;
  const criteria = {
    delete_flag: false,
    company_name: {
      $regex: `.*${keyword}.*`,
    },
  };
  const count = await mdb.Company.count(criteria);
  const pagination = {
    page,
    pageSize: config.pageSize,
    rowCount: count,
    pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
  };

  const companys = await mdb.Company.find(criteria).select('_id company_name');

  res.json({
    models: companys,
    pagination,
  });
};

exports.post_upload = (req, res, next) => {
  upload.fileHandler()(req, res, next);
};

exports.post_xlsx = async (req, res, next) => {
  const func_type = req.query.func_type;
  const fileInfo = req.body;

  try {
    // parse
    const local_file = path.join(config.tmpdir, fileInfo.name);
    let result;
    if (func_type === 'batchly_charge') {
      const company_id = req.query.company_id;
      result = await xlsx.parseBatchlyCharge(local_file, company_id);
    } else if (func_type === 'user_import') {
      const company_id = req.query.company_id;
      result = await xlsx.parseUserImport(local_file, company_id);
    }

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
};
