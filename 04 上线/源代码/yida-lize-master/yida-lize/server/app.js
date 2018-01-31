const config = require('./config');
const logger = require('./lib/logging').getLogger('app');

const path = require('path');
const fs = require('fs');

const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const socketHelper = require('./lib/socket_helper');
const appHelper = require('./lib/app_helper');
const handlebarsHelper = require('./lib/handlebars_helper');

io.on('connection', socket => socketHelper.helper(socket));

appHelper.helper(app, io);

const bodyParser = require('body-parser');
const redis = require('promise-redis')();
const _ = require('lodash');
const favicon = require('serve-favicon');

const exphbs = require('express-handlebars');
const session = require('express-session');
const methodOver = require('method-override');
const cookieParser = require('cookie-parser');
const RedisStore = require('connect-redis')(session);
const Router = require('named-routes');
const Autoloader = require('./lib/autoloader');
const Auth = require('./lib/auth').Auth;
const errors = require('./lib/errors');

const mdb = require('./mongoose');

const redisClient = redis.createClient(config.redis);

// Config named routes
const router = new Router();
router.extendExpress(app);
router.registerAppHelpers(app);

// Config session
const redisStore = new RedisStore({
  client: redisClient,
});

// Public assets
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: redisStore,
  resave: true,
  saveUninitialized: true,
  secret: config.session_secret,
}));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, Cache-Control');
  next();
});

// logger
app.use((req, res, next) => {
  logger.info(`----------- New Request ---------
${req.method}: ${req.originalUrl}
query: ${JSON.stringify(req.query)}
body: ${JSON.stringify(req.body)}
uniqueid: ${req.headers.uniqueid}
user-agent: ${req.headers['user-agent']}
---------------------------------`);
  next();
});

// user authorization
app.use(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      logger.debug('authorization:', req.headers.authorization);
      if (req.headers.authorization.startsWith('Bearer ')) {
        const token = req.headers.authorization.substring('Bearer '.length).trim();

        req.$token = token;
        req.$userInfo = JSON.parse(await redisClient.get(token));
        logger.debug('userInfo:', req.$userInfo.fullname);
      }
    }
  } catch (e) {
    logger.error('无效的token', e);
  }
  next();
});

// staff authorization
app.use(async (req, res, next) => {
  try {
    if (req.headers['user-agent'] == 'staff-webview') { // from webview
      if (req.originalUrl.startsWith('/staff-auth/webview-login/') || (req.session.user)) {
        return next();
      }
      const token = req.query.token;

      return res.redirect(`/staff-auth/webview-login/${token}?redirect=${encodeURIComponent(req.originalUrl)}`);
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Staff ')) { // from restful
      const token = req.headers.authorization.substring('Staff '.length).trim();

      req.$token = token;
      req.$staffInfo = JSON.parse(await redisClient.get(token));
      logger.debug('staffInfo:', token, req.$staffInfo.fullname);

      return next();
    }
  } catch (e) {
    logger.error('无效的token', e);
  }
  return next();
});

// allow overriding methods in query (?_method=put)
app.use(methodOver('_method'));

// Cookie parser
app.use(cookieParser());

// Active URL for helper
let activeRoute = '';
app.use((req, res, next) => {
  const route = router.match(req);
  if (route) {
    activeRoute = route.route.options.name;
  }
  next();
});

// Session-persisted message middleware
app.use((req, res, next) => {
  const err = req.session.error || req.query.error;
  const msg = req.session.msg || req.query.msg;
  delete req.session.error;
  delete req.session.msg;

  res.locals.config = config;
  res.locals.session = req.session;
  res.locals.req = req;
  res.locals.app = app;
  res.locals.user_agent = req.headers['user-agent'];

  res.locals.navs = app.get('navs');

  res.locals.message = '';
  if (err) res.locals.message = `<p class="msg error">${err}</p>`;
  if (msg) res.locals.message = `<p class="msg success">${msg}</p>`;
  next();
});

// load router
fs.readdirSync(path.join(__dirname, 'routers')).forEach((file) => {
  // logger.debug(name);
  if (file.endsWith('.js')) {
    const name = file.split('.')[0];
    let p = '/';
    if (name !== 'index') {
      p = `/${name}`;
    }
    app.use(p, require(`./routers/${name}`)); // name
  }
});

// Register route
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// MVC Autoloader
Autoloader.load(app, {
  verbose: !module.parent,
});

// Auth load and middleware
Auth.load(app);

// Config Handlebars
const blocks = {};
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, config.views.layouts),
  partialsDir: path.join(__dirname, config.views.partials),
  helpers: _.extend({
    url(routeName, params) {
      return app.locals.url(routeName, params);
    },
    activeRoute(routeName) {
      return activeRoute.indexOf(routeName) >= 0 ? 'active' : '';
    },
    activeRoutes(routeNames) {
      const result = _.sum(_.map(routeNames.split(','), routeName => (activeRoute.indexOf(routeName) >= 0 ? 1 : 0)));

      return result > 0 ? 'active' : '';
    },
    block(name) {
      const val = (blocks[name] || []).join('\n');

      // clear the block
      blocks[name] = [];
      return val;
    },
    extend(name, context) {
      let block = blocks[name];
      if (!block) {
        block = blocks[name] = [];
      }

      block.push(context.fn(this));
    },
  }, handlebarsHelper.helper),
});

// View engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Errors load
errors(app);

server.listen(config.port);

const loadData = async (parentApp) => {
  const zone = await mdb.Zone.findOne();
  const buildings = await mdb.Building.find().sort('buildingno');
  const ticketTemplates = await mdb.TicketTemplate.find({});
  parentApp.zone = zone;
  parentApp.buildings = buildings;
  parentApp.ticketTemplates = ticketTemplates;
};
loadData(app);
