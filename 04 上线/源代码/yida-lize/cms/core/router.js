/**
 * 路由表
 */
module.exports = {
  /**
   * 后台首页
   */
  '/admin*': {
    get: 'admin'
  },

  /**
   * API
   */
  '/api': {
    /**
     * 公用部分
     */
    // 当前用户帐号
    '/account': {
      all: 'account.check',
      get: 'account.current',

      '/sign-in': {
        put: 'account.signIn'
      },

      '/sign-out': {
        put: 'account.signOut'
      },

      '/captcha': {
        get: 'account.captcha'
      }
    },

    // 检查是否登录
    '/*': {
      all: 'account.check'
    },

    /**
     * 数据
     */
    // 控制面板数据
    '/dashboard': {
      get: 'dashboard'
    },

    // 推荐
    '/features': {
      get: 'features.all',
      post: 'features.create',

      '/:feature': {
        get: 'features.one',
        put: 'features.update',
        delete: 'features.remove'
      }
    },

    // 内容
    '/contents': {
      get: 'contents.list',
      post: 'contents.create',
      put: 'contents.update',
      delete: 'contents.remove',

      '/:content': {
        get: 'contents.one',
        put: 'contents.update',
        delete: 'contents.remove'
      }
    },

    // 单页
    '/pages/:page': {
      get: 'pages.get',
      put:  'pages.save'
    },

    // 媒体库
    '/media': {
      get: 'media.list',
      post: 'media.create',

      '/:medium': {
        put: 'media.update',
        delete: 'media.remove'
      }
    },

    /**
     * 后台
     */
    // 网站配置
    '/site-info': {
      get: 'site-info.get',
      put: 'site-info.update'
    },

    // 分类管理
    '/categories': {
      get: 'categories.query',
      post: 'categories.create',

      '/:_id': {
        get: 'categories.one',
        put:  'categories.update',
        delete: 'categories.remove'
      }
    },

    // 模型
    '/models': {
      get: 'models.query',
      post:  'models.create',

      '/:_id': {
        get: 'models.one',
        put:  'models.update',
        delete:  'models.remove'
      }
    },

    // 模板
    '/views': {
      get: 'views'
    },

    // 统计
    '/statistics': {
      put: 'statistics'
    }
  },


  // 首页
  '/': { get: 'home'},

  // 搜索页
  '/search': { get: 'search' },

  // 频道页
  '/:channel*': { get: 'channel' },

  // 栏目页
  '/:column*': { get: 'column' },

  // 单页
  '/:page*': { get: 'page' },

  // 内容页
  '/:content*': { get: 'content' },

  // 错误页
  '/*': { get: 'errors.notFound' }
};
