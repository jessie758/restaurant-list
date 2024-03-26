const express = require('express');
const router = express.Router();

const passport = require('../config/passport');

router.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
    authType: 'reauthenticate',
  })
);

router.get(
  '/redirect/facebook',
  passport.authenticate('facebook', {
    successRedirect: '/restaurants',
    failureRedirect: '/login',
    successMessage: true,
    failureMessage: true,
  })
);

module.exports = router;
