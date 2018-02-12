const config = require('../config');
const logger = require('../lib/logging').getLogger('controllers/crud-building');

const _ = require('lodash');
const mdb = require('../mongoose');

exports.prefix = '/crud';

exports.name = 'building';

exports.before = async function (req, res, next) {
  const _id = req.params._id;
  if (!_id) return next();
  const building = await mdb.Building.findById(_id);
  if (!building) return next('route');
  req.var_name = building;
  next();
};

exports.index = function (req, res) {
  res.redirect('/crud/buildings');
};

exports.list = function (req, res) {
  const keyword = req.query.keyword;

  const page = req.query.page ? req.query.page : 1;

  let criteria = {};
  if (keyword) {
    criteria = {
      $or: [{
        building_name: {
          $regex: `.*${keyword}.*`,
        },
      }, {
        building_address: {
          $regex: `.*${keyword}.*`,
        },
      },
      ],
    };
  }

  logger.debug('criteria', criteria);

  mdb.Building.count(criteria).then(async (count) => {
    logger.debug('count:', count);
    const pagination = {
      page,
      pageSize: config.pageSize,
      rowCount: count,
      pageCount: parseInt(count / config.pageSize, 10) + (count % config.pageSize > 0 ? 1 : 0),
    };

    const list = await mdb.Building.find(criteria)
      .sort('buildingno')
      .skip((page - 1) * config.pageSize)
      .limit(config.pageSize);
    //
    res.render('crud-building/list', {
      title: '建筑列表',
      list,
      pagination,
    });
  }).catch((err) => {
    logger.error('err:', err);
  });
};

exports.new = function (req, res) {
  res.render('crud-building/new', {
    title: '新建建筑',
  });
};

exports.create = async function (req, res) {
  const building = req.body.building;
  building.loc = [building.loc_lat, building.loc_lng];
  if (building) {
    try {
      const Building = new mdb.Building(building);
      await Building.save();
      req.session.msg = 'Admin创建成功!';
      res.redirect(`/crud/building/${Building._id}`);
    } catch (err) {
      logger.error(err);
      req.session.error = err.message;
      res.redirect('back');
    }
  } else {
    res.redirect('/crud/buildings');
  }
};

exports.show = async function (req, res) {
  res.render('crud-building/show', {
    title: '建筑详细',
    data: req.var_name,
  });
};

exports.edit = function (req, res) {
  res.render('crud-building/edit', {
    title: '修改建筑',
    data: req.var_name,
  });
};

exports.update = async function (req, res) {
  const _id = req.params._id;
  const building = req.body.building;
  building.loc = [building.loc_lat, building.loc_lng];
  try {
    await mdb.Building.findByIdAndUpdate(_id, building);
    req.session.msg = '修改建筑成功!';
    res.redirect(`/crud/building/${_id}`);
  } catch (err) {
    logger.error(err);
    req.session.error = '修改建筑失败!';
    res.redirect(`/crud/building/${_id}/edit`);
  }

  try {
    const content = `${req.session.user.username} 修改了:${JSON.stringify(building)}`;
    await mdb.Building.findByIdAndUpdate(_id, {
      $push: {
        events: {
          $each: [{
            content,
          }],
          $position: 0,
        },
      },
    });
  } catch (err) {
    logger.error(err);
  }
};

exports.delete = function (req, res) {
  let result = '';

  mdb.Building.findOneAndRemove({ _id: req.var_name._id }, (err) => {
    if (err) {
      req.session.error = '删除建筑失败!';
      result = err.message;
    } else {
      req.session.msg = '删除建筑成功!';
      result = 'Deleted';
    }

    res.json({ result });
  });
};
