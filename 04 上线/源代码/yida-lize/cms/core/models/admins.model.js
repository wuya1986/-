var sha1 = require('../services/sha1.service');
var mongoose = require('mongoose');
mongoose.set('debug', true);

/**
 * 用户模型
 */
var adminsSchema = new mongoose.Schema({
  // 登录用
  username: {
    type: String,
    unique: true,
  },
  password: String,
  fullname: String,
  acl_roles: [String],
  avatar: String, //头像地址，保存到/public/avatars/staff_*.png
  id_card: String,
  memo: String,
  delete_flag: {
    type: Boolean,
    default: false,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
  push_device_id: String,
  push_device_type: String,
}, {
  collection: 'admins',
  id: false
});

/**
 * 发布为模型
 */
module.exports = mongoose.model('Admin', adminsSchema);
