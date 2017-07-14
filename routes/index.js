var express = require('express');
var router = express.Router();
var models = require('../models/models')
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var queue = [];

router.use(function(req, res, next) {
  if (req.user) next();
  else res.redirect('/login');
})

/* GET home page. */
router.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/index');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/index', function(req, res) {
  res.render('index', {
    user: req.user.username
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

router.post('/add', function(req, res) {
  var currentId = req.user._id;
  res.send(currentId);
});

module.exports = router;
