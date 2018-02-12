const config = require('./config');

module.exports = {
  shortcuts: [
    {
      id: 'canvass_business_center',
      title: '招商租赁',
      uri: '/applications/contents/list/property_lease',
      roles: [
        '授权人',
        '园区客户',
        '访客',
      ],
    },
    {
      id: 'property_service',
      title: '报修维修',
      uri: '/tickets/list/property_repair',
      roles: [
        '授权人',
      ],
    },
    {
      id: 'enterprise_service',
      title: '产业联盟',
      uri: '/applications/contents/list/industry_alliance',
      roles: [
        '授权人',
        '园区客户',
      ],
    },
    {
      id: 'park_activity',
      title: '园区活动',
      uri: 'http://www.hdb.com/dalian/',
      roles: [
        '授权人',
        '园区客户',
      ],
    },
    {
      id: 'intelligent_life',
      title: '智优生活',
      uri: '/applications/intelligent_life',
      roles: [
        '授权人',
        '园区客户',
        '访客',
      ],
    },
    {
      id: 'living_consumption',
      title: '生活消费',
      uri: '/applications/living_consumption',
      roles: [
        '授权人',
        '园区客户',
      ],
    },
    {
      id: 'parking_service',
      title: '停车服务',
      uri: '/applications/parking_service',
      roles: [
        '授权人',
        '园区客户',
      ],
    },
  ],
  applications: [
    {
      title: '企业授权人',
      roles: [
        '授权人',
      ],
      children: [
        {
          id: 'certificate_employee',
          title: '认证员工',
          uri: '/applications/employees',
          roles: [
            '授权人',
          ],
        }, {
          id: 'batchly_charge',
          title: '集体充值',
          uri: '/applications/contents/show/ji-ti-chong-zhi',
          roles: [
            '授权人',
          ],
        },
      ],
    },
    {
      title: '招商中心',
      roles: [
        '授权人',
        '园区客户',
        '访客',
      ],
      children: [
        {
          id: 'park_introduction',
          title: '园区介绍',
          uri: '/applications/contents/show/yuan-qu-jie-shao',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
        {
          id: 'reserve_visit',
          title: '预约参观',
          uri: '/tickets/new/reserve_visit',
          roles: [
            '访客',
          ],
        },
        {
          id: 'big_events',
          title: '园区大事记',
          uri: '/applications/contents/list/big_events',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
        {
          id: 'property_lease',
          title: '招商租赁',
          uri: '/applications/contents/list/property_lease',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
        {
          id: 'zone_policy',
          title: '园区政策',
          uri: '/applications/contents/list/park_policy',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
        {
          id: 'vr_map',
          title: '园区VR地图',
          uri: 'http://www.comegogogo.com/tour/6f1249e2469a8c95?from=singlemessage&isappinstalled=0',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
        {
          id: 'geolocation',
          title: '一键导航',
          uri: '/applications/geolocation',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
        {
          id: 'notice_news',
          title: '公告新闻',
          uri: '/applications/contents/list/notice_news',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
      ],
    },
    {
      title: '物业服务',
      roles: [
        '授权人',
        '园区客户',
      ],
      children: [
        {
          id: 'property_repair',
          title: '报修维修',
          uri: '/tickets/list/property_repair',
          roles: [
            '授权人',
          ],
        },
        {
          id: 'guest_visit',
          title: '访客管理',
          uri: '/tickets/list/guest_visit',
          roles: [
            '授权人',
            '园区客户',
          ],
        },
        {
          id: 'complaint_advice',
          title: '投诉建议',
          uri: '/tickets/list/complaint_advice',
          roles: [
            '授权人',
            '园区客户',
          ],
        },
        {
          id: 'equipment_io',
          title: '物品出入',
          uri: '/tickets/list/equipment_io',
          roles: [
            '授权人',
          ],
        },
        {
          id: 'meter',
          title: '水电煤抄表',
          uri: '/applications/meters',
          roles: [
            '授权人',
          ],
        },
        {
          id: 'office_handover',
          title: '房屋交接',
          uri: '/tickets/list/office_handover',
          roles: [
            '授权人',
          ],
        },
        {
          id: 'office_decoration',
          title: '装修管理',
          uri: '/tickets/list/office_decoration',
          roles: [
            '授权人',
          ],
        },
        {
          id: 'settle_io',
          title: '入驻/退租',
          uri: '/tickets/list/settle_io',
          roles: [
            '授权人',
          ],
        },
      ],
    },
    {
      title: '企业服务',
      roles: [
        '授权人',
        '园区客户',
        '访客',
      ],
      children: [
        {
          id: 'bus_info',
          title: '园区巴士',
          uri: '/applications/contents/show/yuan-qu-ba-shi',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
        {
          id: 'industry_map',
          title: '产业地图',
          uri: '/applications/industry_map',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
        {
          id: 'industry_alliance',
          title: '产业联盟',
          uri: '/applications/contents/list/industry_alliance',
          roles: [
            '授权人',
            '园区客户',
          ],
        },
        {
          id: 'park_activity',
          title: '园区活动',
          uri: 'http://www.hdb.com/dalian/',
          roles: [
            '授权人',
            '园区客户',
          ],
        },
        {
          id: 'intelligent_life',
          title: '智优生活',
          uri: '/applications/intelligent_life',
          roles: [
            '授权人',
            '园区客户',
            '访客',
          ],
        },
        {
          id: 'living_consumption',
          title: '生活消费',
          uri: '/applications/living_consumption',
          roles: [
            '授权人',
            '园区客户',
          ],
        },
      ],
    },
  ],
  wallet: [
    {
      children: [
        {
          id: 'recharge',
          title: '充值',
          color: '#16a085',
          icon: 'cash',
          uri: '/applications/ecard_recharge',
        },
        {
          id: 'bill_record',
          title: '我的账单',
          color: '#d35400',
          icon: 'card',
          uri: '/applications/ecard_bill_record',
          last: true,
        },
      ],
    }, {
      children: [
        {
          id: 'cancellation',
          title: '注销一卡通',
          color: '#2ecc71',
          icon: 'exit',
          uri: '/applications/ecard_cancellation',
        },
        {
          id: 'report_loss',
          title: '挂失补卡',
          color: '#c0392b',
          icon: 'lock',
          uri: '/applications/ecard_report_loss',
          last: true,
        },
      ],
    },
  ],
};
