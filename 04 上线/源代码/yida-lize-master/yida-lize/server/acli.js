const config = require('./config');
const _ = require('lodash');

const node_acl = require('acl');
const mdb = require('./mongoose');

const acl = new node_acl(new node_acl.mongodbBackend(mdb.conn.db, config.id));

const shell = require('shell');

const app = new shell();
app.configure(() => {
  app.use(shell.completer({
    shell: app,
  }));

  app.use(shell.router({
    shell: app,
  }));
});
// Event notification
app.on('quit', () => {
  mdb.conn.close();
});

app.cmd('help', (req, res) => {
  res.yellow('addRoleParents role parents\n');
  res.yellow('addUserRoles userId roles\n');
  res.yellow('allow roles resources permissions\n');
  res.yellow('allowedPermissions userId resources\n');
  res.yellow('areAnyRolesAllowed roles resource permissions\n');
  res.yellow('hasRole userId role\n');
  res.yellow('isAllowed userId resource permissions\n');
  res.yellow('optimizedAllowedPermissions userId resources\n');
  res.yellow('permittedResources roles permissions\n');
  res.yellow('removeAllow role resources permissions\n');
  res.yellow('removePermissions role resources permissions\n');
  res.yellow('removeResource resource\n');
  res.yellow('removeRole role\n');
  res.yellow('removeRoleParents role parents\n');
  res.yellow('removeUserRoles userId roles\n');
  res.yellow('roleUsers role\n');
  res.yellow('userRoles userId\n');
  res.yellow('whatResources roles\n');

  res.prompt();
});
app.cmd('addUserRoles :userId :roles', (req, res) => {
  const userId = req.params.userId;
  let roles = req.params.roles;
  roles = roles.split(',');

  acl.addUserRoles(userId, roles, (err) => {
    acl.userRoles(userId, (err, roles) => {
      console.log(roles);
      res.prompt();
    });
  });
});
app.cmd('removeUserRoles :userId :roles', (req, res) => {
  const userId = req.params.userId;
  let roles = req.params.roles;
  roles = roles.split(',');

  acl.removeUserRoles(userId, roles, (err) => {
    acl.userRoles(userId, (err, roles) => {
      console.log(roles);
      res.prompt();
    });
  });
});
app.cmd('allowedPermissions :userId :resources', (req, res) => {
  const userId = req.params.userId;
  let resources = req.params.resources;
  resources = resources.split(',');

  acl.allowedPermissions(userId, resources, (err, permissions) => {
    console.log(permissions);
    res.prompt();
  });
});
app.cmd('allow :roles :resources :permissions', (req, res) => {
  let roles = req.params.roles;
  roles = roles.split(',');
  let resources = req.params.resources;
  resources = resources.split(',');
  let permissions = req.params.permissions;
  permissions = permissions.split(',');

  acl.allow(roles, resources, permissions, (err) => {
    acl.whatResources(roles, (err, resources) => {
      console.log(resources);
      res.prompt();
    });
  });
});
app.cmd('removeAllow :role :resources :permissions', (req, res) => {
  const role = req.params.role;
  let resources = req.params.resources;
  resources = resources.split(',');
  let permissions = req.params.permissions;
  permissions = permissions.split(',');

  acl.removeAllow(role, resources, permissions, (err) => {
    acl.whatResources(role, (err, resources) => {
      console.log(resources);
      res.prompt();
    });
  });
});
app.cmd('addRoleParents :role :parents', (req, res) => {
  const role = req.params.role;
  const parents = req.params.parents;

  acl.addRoleParents(role, parents, (err) => {
    console.log('ok');
    res.prompt();
  });
});
app.cmd('removeRoleParents :role :parents', (req, res) => {
  const role = req.params.role;
  const parents = req.params.parents;

  acl.removeRoleParents(role, parents, (err) => {
    console.log('ok');
    res.prompt();
  });
});
app.cmd('removeRole :role', (req, res) => {
  const role = req.params.role;

  acl.removeRole(role, (err) => {
    console.log('ok');
    res.prompt();
  });
});
app.cmd('removeResource :resource', (req, res) => {
  const resource = req.params.resource;

  acl.removeResource(resource, (err) => {
    console.log('ok');
    res.prompt();
  });
});
app.cmd('whatResources :roles', (req, res) => {
  let roles = req.params.roles;
  roles = roles.split(',');

  acl.whatResources(roles, (err, resources) => {
    console.log(resources);
    res.prompt();
  });
});
app.cmd('userRoles :userId', (req, res) => {
  const userId = req.params.userId;

  acl.userRoles(userId, (err, roles) => {
    console.log(roles);
    res.prompt();
  });
});
app.cmd('roleUsers :role', (req, res) => {
  const role = req.params.role;

  acl.roleUsers(role, (err, users) => {
    console.log(users);
    res.prompt();
  });
});
app.cmd('hasRole :userId :role', (req, res) => {
  const userId = req.params.userId;
  const role = req.params.role;

  acl.hasRole(userId, role, (err, hasRole) => {
    console.log(hasRole);
    res.prompt();
  });
});
app.cmd('isAllowed :userId :resource :permissions', (req, res) => {
  const userId = req.params.userId;
  const resource = req.params.resource;
  let permissions = req.params.permissions;
  permissions = permissions.split(',');

  acl.isAllowed(userId, resource, permissions, (err, allowed) => {
    console.log(allowed);
    res.prompt();
  });
});
app.cmd('areAnyRolesAllowed :roles :resource :permissions', (req, res) => {
  let roles = req.params.roles;
  roles = roles.split(',');
  const resource = req.params.resource;
  let permissions = req.params.permissions;
  permissions = permissions.split(',');

  acl.areAnyRolesAllowed(roles, resource, permissions, (err, allowed) => {
    console.log(allowed);
    res.prompt();
  });
});
