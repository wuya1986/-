const config = require('../../config');
const logger = require('../../lib/logging').getLogger('lib/auth/index');
const _ = require('lodash');

const node_acl = require('acl');
const mdb = require('../../mongoose');

const acl = new node_acl(new node_acl.mongodbBackend(mdb.conn.db, config.id));

exports.isAllowed = (permissions, resource, permission) => {
  const allow = (
    permissions &&
      permissions[resource] &&
      (
        permissions[resource].indexOf(permission) >= 0 ||
          permissions[resource].indexOf('admin') >= 0
      ));
  return allow;
};


exports.allowedPermissions = (userId, resources) => acl.allowedPermissions(userId, resources);

exports.setUserRoles = async (userId, roles) => {
  // all user roles
  const oldRoles = await acl.userRoles(userId);

  if (oldRoles && oldRoles.length > 0) {
    // delete them
    logger.info('removeUserRoles', userId, oldRoles);
    await acl.removeUserRoles(userId, oldRoles);
  }

  logger.info('addUserRoles', userId, roles);
  // add new user role
  return await acl.addUserRoles(userId, roles);
};
