const config = require('../config');
const logger = require('../lib/logging').getLogger('lib/mssql');

const mssql = require('mssql');

const connection = mssql.connect(config.ecard_mssql, (err) => {
  if (err) { throw err; }
});

module.exports = connection;
