const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/upload');

const path = require('path');
const fs = require('fs');

const express = require('express');

const mdb = require('../mongoose');

const router = express.Router();

//
// curl -X POST https://admin.yidalize.com/upload  -H "Authorization: Bearer JDJhJDEwJG1zdGZBdVBXWnh5ZTk2TkNpZlU3aE8zUGNpSkg3QUxMemtZWVE3Y09hQk1nWGJNN0Y3MFhD" -H "Content-Type: application/json" -d '{"avatar":"XXXXXXX"}'
router.post('/avatar', async (req, res, next) => {
  // save  base64-encoded image to disk
  const avatar = `avatars/${req.$userInfo._id}_avatar.png`;

  const avatar_file = path.join(config.avatar_outputs, avatar);
  fs.writeFileSync(avatar_file, req.body.avatar, 'base64');
  logger.info('save to', avatar_file);

  // save db
  await mdb.User.update({
    _id: req.$userInfo._id,
  }, {
    avatar,
  });

  res.json({
    success: true,
    avatar,
  });
});


const multer = require('multer');

const storage = multer.diskStorage({
  destination: `${config.images_outputs}`,
  filename(req, file, cb) {
    // Mimetype stores the file type, set extensions according to filetype
    switch (file.mimetype) {
      case 'image/jpeg':
        ext = 'jpeg';
        break;
      case 'image/png':
        ext = 'png';
        break;
      case 'image/gif':
        ext = 'gif';
        break;
    }

    const saveName = `${file.originalname}.${ext}`;
    logger.info('save to', saveName);
    cb(null, saveName);
  },
});
const upload = multer({ storage });

// curl -X GET http://admin.yidalize.com/upload/myimages
router.post('/uploadHandler', upload.single('file'), (req, res, next) => {
  if (req.file && req.file.originalname) {
    logger.info(`Received file ${req.file.originalname}`);
  }

  res.send({ responseText: req.file.path }); // You can send any response to the user here
});

router.get('/myimages', (req, res, next) => {
  const list = fs.readdirSync(config.images_outputs);
  res.json({
    success: true,
    list,
  });
});


module.exports = router;
