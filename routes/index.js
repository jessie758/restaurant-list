const express = require('express');
const router = express.Router();

const restaurants = require('./restaurants');
const users = require('./users');
const oauth = require('./oauth');
const root = require('./root');

const authHandler = require('../middlewares/auth-handler');

router.use('/restaurants', authHandler, restaurants);
router.use('/users', users);
router.use('/oauth', oauth);
router.use('/', root);

module.exports = router;
