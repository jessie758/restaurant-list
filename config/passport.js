const passport = require('passport');
const LocalStrategy = require('passport-local');

const db = require('../models');
const User = db.User;

const bcrypt = require('bcryptjs');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, {
            type: 'error',
            message: 'Email 或密碼錯誤！',
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            type: 'error',
            message: 'Email 或密碼錯誤！',
          });
        }

        return done(null, user);
      } catch (error) {
        error.errorMessage = '登入失敗！';
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id, {
    attribute: ['id', 'name', 'email'],
    raw: true,
  });

  return done(null, user);
});

module.exports = passport;
