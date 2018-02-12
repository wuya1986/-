const config = require('../config');
const logger = require('../lib/logging').getLogger('controllers/acl');
const _ = require('lodash');

const node_acl = require('acl');

const mdb = require('../mongoose');

const acl = new node_acl(new node_acl.mongodbBackend(mdb.conn.db, config.id));

exports.prefix = '/acl';

exports.index = (req, res) => {
  res.render('acl/index', {
    title: 'ACL ',
    roles: config.acl.roles,
    resources: config.acl.resources,
  });
};

exports.role = async (req, res, next) => {
  const role = req.query.name;

  const resources = await acl.whatResources(role);
  const admins = await mdb.Admin.find({
    acl_roles: {
      $in: [role],
    },
  }).sort({
    _id: -1,
  }).populate('user', 'fullname avatar');

  res.render('acl/role', {
    title: 'role ',
    resources,
    admins,
  });
};
