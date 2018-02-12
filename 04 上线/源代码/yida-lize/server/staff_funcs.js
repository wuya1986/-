const config = require('./config');

module.exports = {
  company_applications: [
    {
      id: 100,
      title: '企业服务',
      divider: true,
    },
    {
      id: 'company',
      title: '企业管理',
      uri: `${config.url}/crud/companys`,
    },
    {
      id: 'user',
      title: '员工管理',
      uri: `${config.url}/crud/users`,
      last: true,
    },
  ],
  admin_applications: [
    {
      id: 900,
      title: '系统管理',
      divider: true,
    },
    {
      id: 'cms',
      title: 'CMS留言评论',
      uri: `${config.url}/crud/cmss`,
    },
    {
      id: 'message',
      title: '消息管理',
      uri: `${config.url}/crud/messages`,
    },
    {
      id: 'ticket_template',
      title: '工作票模版',
      uri: `${config.url}/crud/ticket_templates`,
    },
    {
      id: 'admin',
      title: '管理员',
      uri: `${config.url}/crud/admins`,
    },
  ],
};
