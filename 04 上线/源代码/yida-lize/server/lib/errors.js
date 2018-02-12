const logger = require('../lib/logging').getLogger('lib/error');
/**
 * Error middlewares
 */

module.exports = (parentApp) => {
  // catch 404 and forward to error handler
  parentApp.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  parentApp.use((err, req, res, next) => {
    if (err && err.status !== 404) logger.error(err);

    const page = err.status === 404 ? 'errors/404' : 'errors/500';
    const layout = req.session && req.session.user ? 'main' : 'auth';
    const title = err.status === 404 ? `${err.status} ${err.message}` : '500 Internal Server Error';

    res.status(err.status || 500);

    // development error handler
    // will print stacktrace
    const error = parentApp.get('env') === 'development' ? {} : err;

    res.render(page, {
      message: err.message,
      error,
      title,
      layout,
    });
  });
};
