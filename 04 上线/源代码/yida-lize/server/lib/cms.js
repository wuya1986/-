const config = require('../config');
const logger = require('../lib/logging').getLogger('lib/cms.js');
const mdb = require('../mongoose');
const _ = require('lodash');

/**
 * 从CMS的“推荐模型”取得数据， 直接查询Features数据库
 */
const swipers = async () => {
  let features = await mdb.Features.find({})
    .select('model sort title url thumbnail media extensions')
    .populate('thumbnail', 'fileName description date src')
    .populate('media', 'fileName description date src')
    .sort('sort');
  features = _.map(features, (feature) => {
    if (feature.thumbnail) var thumbnailSrc = feature.thumbnail.src;
    if (!_.isEmpty(feature.media)) var meiaSrc = _.map(feature.media, 'src');

    feature = feature.toObject();

    if (feature.thumbnail) feature.thumbnail.src = thumbnailSrc;
    if (!_.isEmpty(feature.media)) {
      _.forEach(feature.media, (medium, index) => {
        medium.src = meiaSrc[index];
      });
    }

    return feature;
  });
  return features;
};

const news = async () => {
  let news = await mdb.Contents.find({
    category: '59f94fb862133f2ce3842ea9',
    deleted: false,
    status: 'pushed',
  }).sort('status -date').limit(2)
    .select('status category title alias user date thumbnail abstract extensions')
    .populate('user', 'fullname username')
    .populate('thumbnail', 'fileName description date src');
  news = _.map(news, (neww) => {
    if (neww.thumbnail) var thumbnailSrc = neww.thumbnail.src;
    if (!_.isEmpty(neww.media)) var meiaSrc = _.map(neww.media, 'src');

    neww = neww.toObject();

    if (neww.thumbnail) neww.thumbnail.src = thumbnailSrc;
    if (!_.isEmpty(neww.media)) {
      _.forEach(neww.media, (medium, index) => {
        medium.src = meiaSrc[index];
      });
    }

    return neww;
  });
  return news;
};

exports.swipers = swipers;
exports.news = news;
