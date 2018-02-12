const config = require('./config');
const logger = require('./lib/logging').getLogger('mongoose');

const Categories = require('./models/categories.model');
const Contents = require('./models/contents.model');
const Features = require('./models/features.model');
const Media = require('./models/media.model');
const Models = require('./models/models.model');
const Options = require('./models/options.model');

const bcrypt = require('bcrypt-as-promised');

const mongoose = require('mongoose');

mongoose.set('debug', true);

mongoose.connect(config.mongoose.connect);
mongoose.Promise = global.Promise;
const conn = exports.conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'mongo connection error.'));

// Zone:小区 或者 园区
const zoneSchema = mongoose.Schema({
  title: String,
  address: String,
  memo: String,
  image: String,
  welcome: String,
  service_start_date: {
    type: Date,
    default: Date.now,
  },
  events: [{
    create_date: {
      type: Date,
      default: Date.now,
    },
    content: String,
  }],
});

// 用户公司
const CompanySchema = mongoose.Schema({
  company_name: String, //公司名称
  location: String, //所在位置
  floor: String, //层
  number: String, //号
  production: String, //产品名称
  production_category: String, //产品性质
  category_type: String, //所属产业
  employee_count: Number, //员工数
  capital: Number, //投资规模
  lega_person: String, //法人
  build_date: Date, //创立日期
  create_date: Date,
  website: String, // 企业网址
  memo: String, // 其他,
  delete_flag: {
    type: Boolean,
    default: false,
  },
});

// 公司水电煤
const MeterSchema = mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  meter_number: String, // 表号,
  meter_type: { // 类别,
    type: String,
    default: '',
    enum: ['', '水', '电', '煤'],
  },
  meter_location: String, // 位置,
  meter_readings: [{//记录
    create_date: {
      type: Date,
      default: Date.now,
    },
    before_number: Number, //前次表数
    this_number: Number, //本次表数
    multiple: Number, //倍率
    this_usage: Number, //本期用量
    company_confirm: String, //租户确认
  }],
  create_date: Date,
  delete_flag: {
    type: Boolean,
    default: false,
  },
});

// User:园区企业员工
const userSchema = mongoose.Schema({
  uuid: String, // mobile uniqueid
  mobile_no: {
    index: true,
    type: String,
  },
  openid: {
    index: true,
    type: String,
  },
  // 身份证
  id_card: {
    index: true,
    type: String,
  },
  fullname: String,
  // 一卡通卡号
  e_card: {
    index: true,
    type: String,
  },
  // 车牌号
  vpl_number: String,
  sex: Number,
  //头像地址，保存到/public/avatars/*.png
  avatar: {
    type: String,
    default: 'avatars/avatar.svg',
  },
  dob: String,
  push_device_id: String,
  push_device_type: String,
  create_date: {
    type: Date,
    default: Date.now,
  },
  delete_flag: {
    type: Boolean,
    default: false,
  },
  // 员工申请标志
  request_employee: {
    type: String,
    default: '',
    enum: ['', '申请', '同意', '拒绝'],
  },
  // 访客／园区客户／授权人
  role: {
    type: String,
    default: '访客',
    enum: ['访客', '园区客户', '授权人'],
  },
  // 没有company的话，为访客
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  memo: String,
  events: [{
    create_date: {
      type: Date,
      default: Date.now,
    },
    content: String,
  }],
});

// Admin:管理人员
const adminSchema = mongoose.Schema({
  // 登录用
  username: {
    type: String,
    unique: true,
  },
  password: String,
  fullname: String,
  acl_roles: [String],
  //头像地址，保存到/public/avatars/staff_*.png
  avatar: {
    type: String,
    default: 'avatars/avatar.svg',
  },
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
});

adminSchema.statics.login = async function (username, password) {
  const u = await Admin.findOne({
    username,
    delete_flag: false,
  });
  if (u) {
    const res = await bcrypt.compare(password, u.password);
    if (res) {
      return u.toObject();
    }
    throw new Error('password is invalid.');
  }
  throw new Error('username is invalid.');
};

// UserPay:用户支付
const userPaySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  transaction_id: {
    index: true,
    type: String,
  },
  refund_id: String,
  event_type: String,
  event_id: String,
  body: String,
  total_fee: Number,
  progress: String,
  payed_date: Date,
  refund_date: Date,
  extensions: { //业务参数，车牌号，缴费月数等等
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

// Message
const MessageSchema = mongoose.Schema({
  from_admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  from_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to_admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  to_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  msgType: {
    type: String,
    default: 'text',
  },
  content: String,
  business_type: {
    type: String,
    ref: 'TicketTemplate',
  }, //业务类型，包括TicketTemplate
  extensions: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  }, //{staff_url: ''}
  hasRead: {
    type: Boolean,
    default: false,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

// TicketTemplate: ticket带的一个Ticket表单，供票相关的人填写，并可以输出到excel。授权人当前票的业务种类
const TicketTemplateSchema = mongoose.Schema({
  _id: String, // 业务的unque名称，比如property_repair
  title: {
    unique: true,
    type: String,
  },
  progress_extensions: {
    type: mongoose.Schema.Types.Mixed,
    default: [{
      step: '已受理',
      roles: ['building_manager', 'building_service'],
    }, {
      step: '进行中',
      roles: ['building_manager', 'building_service'],
    }, {
      step: '处理完毕',
      roles: ['building_manager', 'building_service'],
    }],
  }, 
  progress_redirects: {
    type: mongoose.Schema.Types.Mixed,
  }, 
  /*
  [
    {
        "current_step": "工程经理复检",
        "check_key": "hide_acceptance_check_result",
        "check_value": "验收合格",
        "redirect_step": "处理完毕"
    },
    {
        "current_step": "处理完毕",
        "check_key": "hide_acceptance_check_retest_result",
        "check_value": "待整改后复验",
        "redirect_step": "工程经理复检"
    }
  ]

  */
  // 扩展
  expired_days: Number,
  indicate_file: String, // 进度指示用timeline handlebars
  form_file: String, // 输入用handlebars
  excel_file: String, // 输出用excel文件
  user_guide: String, // 对用户的指导文档
  admin_guide: String, // 对管理员的指导文档
  events: [{
    create_date: {
      type: Date,
      default: Date.now,
    },
    content: String,
  }],
});

// 票: user起票，由运营经理分配，大家可以回复，解决
const TicketSchema = mongoose.Schema({
  // 起票管理员
  from_admin: {
    ref: 'Admin',
    type: mongoose.Schema.Types.ObjectId,
  },
  // 关联企业
  company: {
    ref: 'Company',
    type: mongoose.Schema.Types.ObjectId,
  },
  // 起票用户
  from_user: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
  // 票的负责人，推进进度
  to: [{
    ref: 'Admin',
    type: mongoose.Schema.Types.ObjectId,
  }],
  ticket_template: {
    type: String,
    ref: 'TicketTemplate',
  },
  form_data: mongoose.Schema.Types.Mixed,
  content: String,
  //已受理，进行中。。。处理完毕
  progress: {
    type: String,
    default: '已受理',
  },
  delete_flag: {
    type: Boolean,
    default: false,
  },
  comments: [{
    create_date: {
      type: Date,
      default: Date.now,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    content: String,
  }],
  user_comment: String,
  // 用户关闭
  user_closed: {
    type: Boolean,
    default: false,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
  events: [{
    create_date: {
      type: Date,
      default: Date.now,
    },
    content: String,
  }],
});

// Product:商品
const productSchema = mongoose.Schema({
  //标题
  title: {
    type: String,
    required: true
  },
  //发布人
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  //缩略图
  thumbnail: String,
  //摘要
  abstract: String,
  //内容
  content: String,
  // 价格
  price: Number,
  //标签
  tags: [String],
  delete_flag: {
    type: Boolean,
    default: false,
  },
});

// Order:订单
const orderSchema = mongoose.Schema({
  //发布人
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  //状态
  status: {
    type: String,
    default: 'draft',
    enum: ['unified', 'payed', 'cancel']
  },
  ecard_recid: Number,//消费数据表 记录ID
  // 明细
  items: [{
    product:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: Number,
    price: Number,
  }],
  amount: Number,
  delete_flag: {
    type: Boolean,
    default: false,
  },
});

// Building:建筑
const buildingSchema = mongoose.Schema({
  building_name: String,
  building_address: String,
  memo: String,
  loc: {
    type: [Number], // [<longitude>, <latitude>]
    index: '2d', // create the geospatial index
  }, //测试结果经纬度谷歌地球才是最准的，其它的都有偏差
});

const batchlyChargeSchema = mongoose.Schema({
  transaction_id: String,
  company_name: String,
  user_fullname: String,
  user_e_card: String,
  fee: Number,
  create_date: {
    type: Date,
    default: Date.now,
  },
});

const Zone = exports.Zone = mongoose.model('Zone', zoneSchema);
const Building = exports.Building = mongoose.model('Building', buildingSchema);
const BatchlyCharge = exports.BatchlyCharge = mongoose.model('BatchlyCharge', batchlyChargeSchema);
const User = exports.User = mongoose.model('User', userSchema);
const Admin = exports.Admin = mongoose.model('Admin', adminSchema);
const UserPay = exports.UserPay = mongoose.model('UserPay', userPaySchema);
const Message = exports.Message = mongoose.model('Message', MessageSchema);
const TicketTemplate = exports.TicketTemplate = mongoose.model('TicketTemplate', TicketTemplateSchema);
const Ticket = exports.Ticket = mongoose.model('Ticket', TicketSchema);
const Company = exports.Company = mongoose.model('Company', CompanySchema);
const Meter = exports.Meter = mongoose.model('Meter', MeterSchema);
const Product = exports.Product = mongoose.model('Product', productSchema);
exports.Categories = Categories;
exports.Contents = Contents;
exports.Features = Features;
exports.Media = Media;
exports.Models = Models;
exports.Options = Options;
