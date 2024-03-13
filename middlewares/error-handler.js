module.exports = (err, req, res, next) => {
  console.log(err);
  req.flash('error', err.errorMessage || '處理失敗！');
  res.redirect('back');

  next(err);
};
