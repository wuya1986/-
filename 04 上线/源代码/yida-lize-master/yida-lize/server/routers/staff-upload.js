const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/staff-upload');

const path = require('path');
const fs = require('fs');

const express = require('express');

const mdb = require('../mongoose');

const router = express.Router();

//
// curl -X POST https://admin.yidalize.com/staff-upload  -H "Authorization: Bearer JDJhJDEwJG1zdGZBdVBXWnh5ZTk2TkNpZlU3aE8zUGNpSkg3QUxMemtZWVE3Y09hQk1nWGJNN0Y3MFhD" -H "Content-Type: application/json" -d '{"avatar":"XXXXXXX"}'
router.post('/avatar', async (req, res, next) => {
  // save  base64-encoded image to disk
  const avatar = `avatars/staff_${req.$staffInfo._id}_avatar.png`;

  const avatar_file = path.join(config.avatar_outputs, avatar);
  fs.writeFileSync(avatar_file, req.body.avatar, 'base64');
  logger.info('save to', avatar_file);

  // save db
  await mdb.Admin.update({
    _id: req.$staffInfo._id,
  }, {
    avatar,
  });

  res.json({
    success: true,
    avatar,
  });
});

module.exports = router;
