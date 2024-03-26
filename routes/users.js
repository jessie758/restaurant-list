const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.User;

const passport = require('../config/passport');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => res.render('signup'));

router.get('/login', (req, res) => res.render('login'));

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, checkPassword } = req.body;

    if (!email || !password || !checkPassword) {
      req.flash('error', 'Email和密碼不可空白！');
      return res.redirect('back');
    }

    if (password !== checkPassword) {
      req.flash('error', '密碼和確認密碼不相符！');
      return res.redirect('back');
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      req.flash('error', 'Email 已被註冊！');
      return res.redirect('back');
    }

    await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    req.flash('success', '註冊成功！');
    return res.redirect('/restaurants');
  } catch (error) {
    error.errorMessage = '註冊失敗！';
    next(error);
  }
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/restaurants',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
);

module.exports = router;
