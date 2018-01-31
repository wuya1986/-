const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/employee');
const _ = require('lodash');
const express = require('express');
const mdb = require('../mongoose');
const alipush = require('../lib/alipush');

const router = express.Router();

const EMPLOYEE_SELECT = 'fullname avatar mobile_no id_card e_card vpl_number company request_employee role delete_flag push_device_id push_device_type';
// 同公司的员工，定制查询条件
//curl -X GET https://admin.yidalize.com/employee/find_in_mycompany  -H "Authorization: Bearer JDJhJDEwJG1zdGZBdVBXWnh5ZTk2TkNpZlU3aE8zUGNpSkg3QUxMemtZWVE3Y09hQk1nWGJNN0Y3MFhD"
router.get('/find_in_mycompany', async (req, res, next) => {
  try {
    const users = await mdb.User.find({
      company: req.$userInfo.company,
      role: {
        $in: [
          '访客',
          '园区客户',
        ],
      },
    }).select(EMPLOYEE_SELECT);
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// employee
// curl -X GET https://admin.yidalize.com/employee/employee/56789 -H "Authorization: Bearer JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP"
router.get('/employee/:_id', async (req, res, next) => {
  try {
    const employee = await mdb.User.findById(req.params._id)
      .select(EMPLOYEE_SELECT);

    res.json({
      success: true,
      data: employee,
    });
  } catch (err) {
    logger.error(err);
    res.json({
      success: false,
      msg: err,
    });
  }
});

// 认证
// curl -X POST https://admin.yidalize.com/employee/save/587f37aec3260152ee97d847  -H "Authorization: Bearer JDJhJDEwJG1zdGZBdVBXWnh5ZTk2TkNpZlU3aE8zUGNpSkg3QUxMemtZWVE3Y09hQk1nWGJNN0Y3MFhD" -H "Content-Type: application/json" -d '{"request_employee":"同意", "role":"员工"}'
router.post('/save/:employee_id', async (req, res, next) => {
  try {
    const data = req.body;
    if (data.role) {
      data.request_employee = ''; //reset
    }
    logger.info(data);
    const user = await mdb.User.findByIdAndUpdate(req.params.employee_id, data, {
      new: true,
    }).select(EMPLOYEE_SELECT).populate('company');
    res.json({
      success: true,
      data: user,
    });

    // 从XXX变成员工，并且没有e_card的话，create a new message to building_manager & building_service
    if (user.role === '员工' && !user.e_card) {
      const content = `新员工${user.fullname} (${user.company.company_name}) 申请新卡发放`;

      await Promise.all(_.map(_.concat(await mdb.User.find({
        company: user.company._id,
        role: '授权人',
      }).select('_id'), user), async (to_user) => {
        const dbMessage = new mdb.Message({
          from_user: req.$userInfo._id,
          content,
          to_user,
        });
        await dbMessage.save();
        // push message
        alipush.pushMessage(dbMessage._id);
      }));

      await Promise.all(_.map(await mdb.Admin.find({
        acl_roles: {
          $in: ['building_manager', 'building_service'],
        },
      }).select('_id'), async (to_admin) => {
        const dbMessage = new mdb.Message({
          from_user: req.$userInfo._id,
          content,
          to_admin,
          extensions: {
            staff_url: `/crud/user/${user._id}`,
          },
        });
        await dbMessage.save();
        // push message
        alipush.pushMessage(dbMessage._id);
      }));
    } else if (user.role === '访客') {
      // TODO clean message&ticket
      await mdb.Message.remove({
        $or: [{
          from_user: user,
        }, {
          to_user: user,
        }],
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

module.exports = router;
