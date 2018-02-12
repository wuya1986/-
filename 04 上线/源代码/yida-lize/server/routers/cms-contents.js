const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/cms-contents');
const _ = require('lodash');
const express = require('express');
const mdb = require('../mongoose');

const alipush = require('../lib/alipush');

const router = express.Router();

// find by alias
// curl -X GET https://admin.yidalize.com/cms-contents/alias/56789 -H "Authorization: Bearer JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP"
router.get('/alias/:alias', async (req, res, next) => {
  try {
    const contents = await mdb.Contents.findOne({
      alias: req.params.alias,
    }).populate('comments.user');

    //留言，只有相关企业授权人可以看
    if (contents.extensions && contents.extensions.company && req.$userInfo.company) {
      if(_.indexOf(_.split(contents.extensions.company, ' '), req.$userInfo.company._id) < 0){
        contents.comments = [];
      }
    } else {
      contents.comments = [];
    }
    res.json({
      success: true,
      data: contents,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// list by category path
// curl -X GET https://admin.yidalize.com/cms-contents/path/industry_alliance -H "Authorization: Bearer JDJhJDEwJFBxU3RXMDh3SW9jbHZHbTFrWGlVbi5HT3Q2NWM5R1YxS3Z0WjlFdEc4RnlLNy9UY1NsNXZP"
router.get('/path/:path', async (req, res, next) => {
  try {
    const contents = await mdb.Contents.find({
      deleted: false,
      status: 'pushed',
      category: await mdb.Categories.findOne({
        path: `/${req.params.path}`,
      }).select('_id'),
    }).select('status category title alias user date reading thumbnail abstract extensions')
      .populate('category', 'name path')
      .populate('user', 'fullname username')
      .populate('thumbnail', 'fileName description date src')
      .sort('-_id')
      .limit(config.pageSize);

    res.json({
      success: true,
      data: contents,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// find company by keyword
// curl -X GET https://admin.yidalize.com/cms-contents/company/%E4%BA%BF%E8%BE%BE -H "Authorization: Bearer JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP"
router.get('/company/:keyword', async (req, res, next) => {
  const keyword = req.params.keyword;
  try {
    const companies = await mdb.Contents.find({
      deleted: false,
      status: 'pushed',
      category: {
        $in: [
          '59f94f7262133f2ce3842ea8', //产业地图
        ],
      },
      $or: [{
        title: {
          $regex: `.*${keyword}.*`,
        },
      }, {
        abstract: {
          $regex: `.*${keyword}.*`,
        },
      }, {
        content: {
          $regex: `.*${keyword}.*`,
        },
      }],
    });

    res.json({
      success: true,
      data: companies,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// 下单页面， 从referer取得alias后redirect给下单页面
// curl -X GET https://admin.yidalize.com/cms-contents/unify -H "Authorization: Bearer JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP"
router.get('/unify', async (req, res, next) => {
  try {
    const referer = req.header('Referer');
    logger.info('referer', referer);
    let alias = (referer.startsWith(config.cms_url)) ? _.split(referer, /[\/\?]/)[4] : null;
    if (!alias || alias.startsWith('token=')) { // 也许是单页面
      alias = (referer.startsWith(config.cms_url)) ? _.split(referer, /[\/\?]/)[3] : null;
    }

    if (alias) {
      res.redirect(`/applications/industry_alliance_unify/${alias}`);
    } else {
      res.json({
        success: false,
        msg: '无效的地址引用',
      });
    }
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// 留言页面， 从referer取得alias后redirect给留言页面
// curl -X GET https://admin.yidalize.com/cms-contents/comment -H "Authorization: Bearer JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP"
router.get('/comment', async (req, res, next) => {
  try {
    const referer = req.header('Referer');
    logger.info('referer', referer);
    let alias = (referer.startsWith(config.cms_url)) ? _.split(referer, /[\/\?]/)[4] : null;
    if (!alias || alias.startsWith('token=')) { // 也许是单页面
      alias = (referer.startsWith(config.cms_url)) ? _.split(referer, /[\/\?]/)[3] : null;
    }

    if (alias) {
      res.redirect(`/applications/contents/comment/${alias}`);
    } else {
      res.json({
        success: false,
        msg: '无效的地址引用',
      });
    }
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// 留言
// curl -X POST https://admin.yidalize.com/cms-contents/comment/587f37aec3260152ee97d847  -H "Authorization: Bearer JDJhJDEwJG1zdGZBdVBXWnh5ZTk2TkNpZlU3aE8zUGNpSkg3QUxMemtZWVE3Y09hQk1nWGJNN0Y3MFhD" -H "Content-Type: application/json" -d '{"comment":"同意"}'
router.post('/comment/:alias', async (req, res, next) => {
  try {
    const contents = await mdb.Contents.findOneAndUpdate({
      alias: req.params.alias,
    }, {
      $push: {
        comments: {
          $each: [{
            user: req.$userInfo._id,
            content: req.body.comment,
          }],
          $position: 0,
        },
      }
    }).populate('category', 'path');

    const content = `关于“${contents.title}”的留言：${req.body.comment}`;

    //留言，只有相关企业授权人，和物业可以看
    if (contents.extensions && contents.extensions.company) {
      try {
        await Promise.all(_.map(await mdb.User.find({
          company: {
            $in: _.compact(_.split(contents.extensions.company, ' ')),
          },
          role: '授权人',
        }).select('_id'), async (to_user) => {
          const dbMessage = new mdb.Message({
            from_user: req.$userInfo._id,
            to_user,
            content,
          });
          await dbMessage.save();
          // push message
          alipush.pushMessage(dbMessage._id);
        }));
      } catch (err) {
        logger.error(err);
      }
    }

    await Promise.all(_.map(await mdb.Admin.find({
      acl_roles: {
        $in: ['building_manager', 'building_service'],
      },
    }).select('_id'), async (to_admin) => {
      const dbMessage = new mdb.Message({
        from_user: req.$userInfo._id,
        to_admin,
        content,
        extensions: {
          staff_url: `${config.cms_url}/${contents.category.path}/${contents.alias}`,
        },
      });
      await dbMessage.save();
      // push message
      alipush.pushMessage(dbMessage._id);
    }));

    res.json({
      success: true,
      msg: '留言提交成功。',
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// 下单
// curl -X POST https://admin.yidalize.com/cms-contents/unify/587f37aec3260152ee97d847  -H "Authorization: Bearer JDJhJDEwJG1zdGZBdVBXWnh5ZTk2TkNpZlU3aE8zUGNpSkg3QUxMemtZWVE3Y09hQk1nWGJNN0Y3MFhD" -H "Content-Type: application/json" -d '{"unify":"同意"}'
router.post('/unify/:alias', async (req, res, next) => {
  try {
    const data = req.body;
    logger.info(data);
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

module.exports = router;
