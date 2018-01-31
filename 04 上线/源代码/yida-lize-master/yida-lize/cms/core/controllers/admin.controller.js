/**
 * 后台首页
 * @param {Object} req
 * @param {Object} res
 */
module.exports = function (req, res) {
  if (req.originalUrl === '/admin/sign-in' || req.session.user){
    res.sendFile('index.html', { root: './public/assets/admin/' });
  } else {
    res.redirect('/admin/sign-in');
  }
};
