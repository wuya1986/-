// 提供callback url， 被外部模块系统调用

const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/building');
const express = require('express');
const mdb = require('../mongoose');

const router = express.Router();

// 所有楼的坐标
// curl -X GET https://admin.yidalize.com/building
router.get('/', async (req, res, next) => {
  const buildings = await mdb.Building.find();
  res.json({
    success: true,
    data: buildings,
  });
});

module.exports = router;
