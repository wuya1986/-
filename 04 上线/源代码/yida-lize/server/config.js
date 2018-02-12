module.exports = {
  host: '127.0.0.1',
  port: 3023,
  session_secret: '4cbc35e9c702e1ab8672a0f73f8fbc5459335039',

  saltRounds: 10,

  parkUnitfeeMonth: 0.01 * 100, //单月车位费用

  id: 'yida-lize',
  title: '亿达丽泽智慧园区Portal',
  desc: '物业',
  url: 'https://admin.yidalize.com',
  file_url: 'https://file.yidalize.com',
  cms_url: 'https://cms.yidalize.com',
  applications_url: 'https://applications.yidalize.com',
  merchant_url: 'https://merchant.yidalize.com',

  noreply: 'noreply@ruptech.com',

  tmpdir: '/tmp',
  views: {
    layouts: '/views/layouts/',
    partials: '/views/partials/',
    excels: '/templates/',
  },
  images_outputs: '/usr/share/nginx/html/yida-lize-file/images',
  avatar_outputs: '/usr/share/nginx/html/yida-lize-file/',
  print_outputs: '/usr/share/nginx/html/yida-lize-file/excel/',

  app: {
    id: 'wx0ec31f57f582fc61',
    secret: 'f6d9e56f7fc817ad7941c79fd30d9ac4',
  },
  merchant: {
    id: '1487406152',
    key: 'b5694b883ab1ea6cfce092d6e6fc7e53',
  },
  spbill_create_ip: '39.106.104.75',
  wxpay_noti_url: '/wxpay/noti',
  template: {
    parking_wxpay_success: 'ulGvYYmbOAZA9SiF2YXr6QPbgqMAWuCM4toN7jfqPuk',
  },

  unsplash: {
    app_id: '887e803ab673924292ab94c56769c8fc1492d76a289a868bb46166c0abf4a3c6',
    secret: 'e6e6d3a6531ea427d9ab0b968c02abe06c2dd4520dbb06696b70cb95dc44257c',
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: 'huarui1111',
    redis_retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Retry time exhausted');
      }
      if (options.times_connected > 10) {
        return undefined;
      }
      // reconnect after
      return Math.max(options.attempt * 100, 3000);
    },
  },

  juhe: {
    sms: 'ef854654b9dcf71275ddfcecbfa3bb70',
    captcha: 'a2db59121b5106129bf141e849c8685c',
  },

  parkingwang: {
    baseUrl: 'http://api.parkingwang.com:8280',
    appId: 'akawgo4sea71t674',
    appSecret: 'djqst5qvess2l2upkzn5oas9npdoa2mw',
    park_code: 'cc43c50a18a09b299fa2ab25444b9886',
  },

  pagerSize: 10,
  pageSize: 20,

  mongoose: {
    connect: 'mongodb://localhost/yida-property',
  },
  ecard_mssql: {
    user: 'yidalize',
    password: 'ydlz123=',
    server: '192.168.254.1',
    database: 'AIO20170913105955',
    stream: true,
  },
  aliyun: {
    cdn_prefix: '//cdn.bootcss.com',
    // cdn_prefix: '/',
    static_content: '//file.yidalize.com',
    user_push: {
      accessKeyId: 'LTAIT9zNxx6znLTp',
      secretAccessKey: 'V0T2wX8ggoiSuy5N4bhZUaJeg1CmG3',
      endpoint: 'http://cloudpush.aliyuncs.com',
      apiVersion: '2016-08-01',
      iOS: {
        appKey: '24739282',
      },
      android: {
        appKey: '24739283',
      },
    },
    staff_push: {
      accessKeyId: 'LTAIT9zNxx6znLTp',
      secretAccessKey: 'V0T2wX8ggoiSuy5N4bhZUaJeg1CmG3',
      endpoint: 'http://cloudpush.aliyuncs.com',
      apiVersion: '2016-08-01',
      iOS: {
        appKey: '24739830',
      },
      android: {
        appKey: '24738395',
      },
    },
  },
  acl: {
    enabled: true,
    roles: [
      {
        id: 'super_admin',
        text: '超级管理员',
      }, {
        id: 'chief_manager',
        text: '项目总经理',
      }, {
        id: 'ticket_manager',
        text: '工单管理员',
      }, {
        id: 'finace_staff',
        text: '财务总监',
      }, {
        id: 'fee_confirmer',
        text: '费用确认员',
      }, {
        id: 'building_manager',
        text: '运营服务经理',
      }, {
        id: 'building_service',
        text: '运营服务助理',
      }, {
        id: 'security_manager',
        text: '安保经理',
      }, {
        id: 'security_team',
        text: '安保人员',
      }, {
        id: 'repair_manager',
        text: '工程经理',
      }, {
        id: 'repair_team',
        text: '维修人员',
      }, {
        id: 'content_manager',
        text: '内容发布',
      },
    ],
    resources: [
      {
        id: 'building',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'company',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'user',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'e_card',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'parking_service',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'admin',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'cms',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'ticket_template',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'message',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'guest_visit',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'batchly_visitor',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'completed_acceptance_check',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'deposit_refund',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'decoration_application',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'goods_letin',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'goods_letout',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'hide_acceptance_check',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'individual_visitor',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'office_handover',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'property_repair',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'reserve_visit',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'settle_in',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'settle_out',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'meter',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'complaint_advice',
        actions: [
          'list',
          'show',
          'new',
          'edit',
          'import',
        ],
      },
      {
        id: 'parking_apply',
        actions: [
          'list',
          'show',
          'new',
          'edit',
        ],
      },
    ],
  },

  mapper: {
    user_type: {
    },
  },
};
