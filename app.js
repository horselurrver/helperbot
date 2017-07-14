"use strict";

var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
// strategy for git
var validator = require('express-validator');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
mongoose.Promise = global.Promise;

// get in auth, models, routes from different folders
var routes = require('./routes/index');
var auth = require('./routes/auth');
var models = require('./models/models');
// require specific models
var models = require('./models/models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, "views"));//tells it to look for hbs files in views directory
app.engine('.hbs', exphbs({'extname': '.hbs', defaultLayout: 'main'}));//already told engine that all files end with hbs
app.set('view engine', '.hbs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handlabars setup
app.engine('hbs', exphbs({
  extname:'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

// Express validator setup
app.use(validator());

// SESSION SETUP HERE
// app.use(session({
//   secret: 'to be or not to be that is the question',
//   store: new MongoStore({mongooseConnection: mongoose.connection})
// }));

// MONGODB SETUP HERE
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});

// strategy
// serialize
// deserialize

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
