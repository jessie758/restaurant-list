const express = require('express');
const router = express.Router();

const passport = require('../config/passport');

router.get('/signup', (req, res) => res.render('signup'));

router.get('/login', (req, res) => res.render('login'));

router.get('/', (req, res) => res.redirect('/restaurants'));

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/restaurants',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
);

module.exports = router;
