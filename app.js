var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');

// Readig the models
const User = require('./models/user');
const Item = require('./models/item');
const Comment = require('./models/comment');
User.sync().then(async () => {
  Item.belongsTo(User, {foreignKey: 'createdBy'});
  Item.sync();
  Comment.belongsTo(User, {foreignKey: 'userId'});
  Comment.sync();
});


const GitHubStrategy = require('passport-github2').Strategy;
const GITHUB_CLIENT_ID = 'c6b190b35ad2451aac7f';
const GITHUB_CLIENT_SECRET = '172fde0bc62bf6eadcc06b0941d48dc4e64e2432';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(async function () {
      await User.upsert({
        userId: profile.id,
        username: profile.username
      });
      done(null, profile);
    });
  }
));

var indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const itemRouter = require('./routes/item');


var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: '8b5412c608077b0b', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/item', itemRouter);


app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
});

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
