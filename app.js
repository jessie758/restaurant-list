console.log('NODE_ENV:', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const port = 3000;

const { engine } = require('express-handlebars');
const handlebars = require('handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('./config/passport');
const flash = require('connect-flash');
const messageHandler = require('./middlewares/message-handler');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes');

handlebars.registerHelper('equal', (arg1, arg2) => {
  return arg1 === arg2;
});

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(messageHandler);
app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
