module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user || null;
    return next();
  }

  req.flash('error', '尚未登入！');
  return res.redirect('/login');
};
