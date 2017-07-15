"use strict";

var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
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
var Student = models.Student;
var Ta = models.Ta;
var taDisplayName = ["Lisa Hoong", "Moose Paksoy", "Kamran Kara-Pabani", "Syed Mohsin"]; // Lisa, Moose, kamran, Syed

var app = express();

// view engine setup
app.set('views', path.join(__dirname, "views"));//tells it to look for hbs files in views directory
app.engine('.hbs', exphbs({'extname': '.hbs', defaultLayout: 'main'}));//already told engine that all files end with hbs
app.set('view engine', '.hbs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use(session({
  secret: 'to be or not to be that is the question',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

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

passport.use(new SlackStrategy ({
  clientID: "137826509296.214032048054",
  clientSecret: "35d5d477a7a7f1d601182491a33ab744",
  scope: "identity.basic"
},
function(accessToken, refreshToken, profile, done) {
  if (taDisplayName.indexOf(profile.displayName) !== -1) {
    Ta.findOne({username: profile.displayName}, function(err, ta) {
      if (err) {
        return done(err);
      } else if (! ta) {
        var newTA = new Ta ({
          username: profile.displayName,
          available: true,
          isStudent: false,
        });
        newTA.save(function(err, ta2) {
          if (err) {
            return done(err);
          } else {
            return done(null, newTA);
          }
        });
      } else {
        return done(null, ta);
      }
    });
  } else {
    Student.findOne({username: profile.displayName}, function(err, student) {
      if (err) {
        return done(err);
      } else if (! student) {
        var newStudent = new Student({
          username: profile.displayName,
          priority: 3,
          isStudent: true
        });
        newStudent.save(function(err) {
          if (err) {
            return done(err);
          } else {
            return done(null, newStudent);
          }
        });
      } else {
        return done(null, student);
      }
    });
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  Ta.findById(id, function(err, ta) {
    if (ta) done(err, ta);
    else {
      Student.findById(id, function(err, student) {
        done(err, student);
      });
    }
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.body);
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
