const config = require('../config');
const logger = require('../lib/logging').getLogger('controllers/cms');

const _ = require('lodash');
const util = require('util');

const alipush = require('../lib/alipush');

const nws = require('../lib/wxsettings').nws;
const QRCode = require('../lib/qrcode');

const qrcode = new QRCode();

const mdb = require('../mongoose');
const redis = require('promise-redis')();

const redisClient = redis.createClient(config.redis);

exports.prefix = '/crud';

exports.name = 'cms';

exports.before = async function (req, res, next) {
  const _id = req.params._id;
  if (!_id) return next();
  const contents = await mdb.Contents.findById(_id)
    .populate('comments.user');
  if (!contents) return next('route');
  req.var_name = contents;
  next();
};

exports.index = (req, res) => {
  res.redirect('/crud/cmss');
};

exports.list = (req, res) => {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;

  mdb.Message.count({comments:{$elemMatch:{$ne:null}}}).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.Contents.find({comments:{$elemMatch:{$ne:null}}})
      .sort('-comments.create_date')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    
    res.render('crud-cms/list', {
      title: 'List cms',
      list,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};

exports.show = function (req, res) {
  res.render('crud-cms/show', {
    title: 'Show CMS',
    data: req.var_name,
  });
};